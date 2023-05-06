//Game Canvas 
var GameCanva = document.getElementById("GameArea");
var ctx = GameCanva.getContext("2d");
//Arrays
var BulletArray = [];
var TerrainArray = [];
var EnemiesArray = [];

var Playerx, Playery;
var StartingPointx = 10;
var StartingPointy = 130;
Playerx = StartingPointx;
Playery = StartingPointy;
var last_direction = "right";
var Gravity = 2;//Speed of Falling
var Moving_Speed = 2;//Speed of Moving

//Buttons Pressed
var rightPressed = false;
var leftPressed = false;
var fPressed = false;
var spacePressed = false;
var rPressed = false;
//---------
var Health = 3;
var IsJumping = false;
var IsReloading = false;
var Gun1_Ammo_Count = 30;
var Gun1_Clip_Size = 30;
var GameCycleId = 0;//for pause function
var switching = false;//for pause function

//---Images------------
var Character = new Image(9, 8);
Character.src = "Character_Idle.png";
var HealthImageUI = new Image(10, 30);
HealthImageUI.src = "ThreeHearts.png";
var Turret = new Image(13, 10);
Turret.src = "Turret_Left_Idle.png";
//---------------------

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37 || event.keyCode == 65)
    {
        leftPressed = true;
    } else if (event.keyCode == 39 || event.keyCode == 68)
    {
        rightPressed = true;
    } else if (event.keyCode == 32)
    {
        spacePressed = true;
    } else if (event.keyCode == 70)
    {
        fPressed = true;
    } else if (event.keyCode == 82)
    {
        rPressed = true;
    }
});
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 37 || event.keyCode == 65)
    {
        leftPressed = false;
    } else if (event.keyCode == 39 || event.keyCode == 68)
    {
        rightPressed = false;
    } else if (event.keyCode == 32)
    {
        spacePressed = false;
    } else if (event.keyCode == 70)
    {
        fPressed = false;
    } else if (event.keyCode == 82)
    {
        rPressed = false;
    }
});
function KeyHandler() {
    if (leftPressed === true)
    {
        last_direction = "left";
        Character.src = "Character_Idle_Left.png";
        if (Collision(Playerx, Playery) === false)
            Playerx -= 2;
    } else if (rightPressed === true)
    {
        last_direction = "right";
        Character.src = "Character_Idle.png";
        if (Collision(Playerx, Playery) === false)
            Playerx += 2;
    } else if (spacePressed === true)
    {
        Jump();
    } else if (fPressed === true)
    {
        Shoot("yellow", "Player", Playerx, Playery, last_direction);
    } else if (rPressed === true) {
        Reload();
    }
}
function Jump() {
    if (IsJumping == false)
    {
        IsJumping = true;
        Playery -= 30;
    }
}
function Reload() {
    if (IsReloading == false)
    {
        IsReloading = true;
        if (Gun1_Ammo_Count == 0) {
            Gun1_Ammo_Count = Gun1_Clip_Size;
        } else {
            Gun1_Ammo_Count = Gun1_Clip_Size + 1;
        }
        IsReloading = false;
    }
}
function Shoot(color, owner, bulletx, bullety, last_direction) {
    if (Gun1_Ammo_Count !== 0) {
        Gun1_Ammo_Count--;
        if (last_direction === "right") {
            Character.src = "Character_Shoot.png";
        } else {
            Character.src = "Character_Shoot_Left.png";
        }

        BulletArray.push(new BulletObj(color, owner, bulletx, bullety, last_direction));
    }


}
function Collision(x, y) {
    var Collision = false;

    Length = TerrainArray.length;
    for (var i = 0; i < Length; i++)
    {
        if (TerrainArray[i] !== undefined)
        {
            if (x > TerrainArray[i].Cord1 && x < (TerrainArray[i].Cord3 + TerrainArray[i].Cord1) && y > TerrainArray[i].Cord2 && y < (TerrainArray[i].Cord4 + TerrainArray[i].Cord2))
                Collision = true;
        }
        // if((x+Moving_Speed+3)>GameCanva.width || (x-Moving_Speed-3)<0)
        //    Collision = true;
    }
    return Collision;
}

function BulletObj(color, owner, bulletx, bullety, direction) {
    if (direction === "right")
    {
        this.Direction = 1;
        this.BulletX = bulletx + 10;
        this.BulletY = bullety + 5;
    } else
    {
        this.Direction = -1;
        this.BulletX = bulletx;
        this.BulletY = bullety + 5;
    }
    this.Color = color;
    this.Owner = owner;
    this.Speed = 6;
    this.Draw = function () {
        ctx.beginPath();
        if (direction === "right") {
            ctx.arc(this.BulletX, this.BulletY, 2, 0, Math.PI * 2);
        } else {
            ctx.arc(this.BulletX, this.BulletY, 2, 0, Math.PI * 2);
        }

        ctx.fillStyle = this.Color;
        ctx.fill();
        ctx.closePath();
    };
    this.UpdateBullet = function () {
        this.BulletX += this.Speed * this.Direction;
        if (this.BulletX > GameCanva.width ||
                this.BulletX < 0 ||
                this.BulletY < 0 ||
                this.BulletY > GameCanva.height)
            this.DestroyBullet();
    };
    this.DestroyBullet = function () {
        delete this.BulletX;
        delete this.BulletY;
        delete this.Color;
        delete this.Direction;
        delete this.Speed;
        // delete this.UpdateBullet();
        // delete this.DestroyBullet();
    };
}
function TerrainObj(cord1, cord2, cord3, cord4, FillStyle) {
    this.Cord1 = cord1;
    this.Cord2 = cord2;
    this.Cord3 = cord3;
    this.Cord4 = cord4;
    this.DrawTerrain = function () {
        ctx.beginPath();
        ctx.rect(this.Cord1, this.Cord2, this.Cord3, this.Cord4);
        ctx.fillStyle = FillStyle;
        ctx.fill();
        ctx.closePath();
    };
}
function TurretObj(cord1, cord2, direction) {
    this.x = cord1;
    this.y = cord2;
    this.Direction = direction;
    this.Shoot = function () {
        BulletArray.push(new BulletObj("red", "Enemy", this.x, this.y, this.Direction));
    };
    this.Draw = function () {
        ctx.drawImage(Turret, this.x, this.y);
    };
}
function Initilize() {
    TerrainArray.push(new TerrainObj(0, 140, 300, 30, "green"));
    TerrainArray.push(new TerrainObj(100, 120, 100, 10, "green"));
    TerrainArray.push(new TerrainObj(60, 100, 90, 10, "green"));
    TerrainArray.push(new TerrainObj(120, 60, 50, 10, "green"));
    EnemiesArray.push(new TurretObj(180, 115, "left"));
}
function DrawTerrain() {
    Length = TerrainArray.length;
    for (var i = 0; i < Length; i++)
    {
        if (TerrainArray[i] !== undefined)
        {
            TerrainArray[i].DrawTerrain();
        }
    }

}
function DrawBullets() {
    Length = BulletArray.length;
    for (var i = 0; i < Length; i++)
    {
        if (BulletArray[i] !== undefined) {
            BulletArray[i].Draw();
            BulletArray[i].UpdateBullet();
        }
    }

}
function DrawEnemies() {
    Length = EnemiesArray.length;
    for (var i = 0; i < Length; i++)
    {
        if (EnemiesArray[i] !== undefined) {
            EnemiesArray[i].Draw();
        }
    }
}
function UpdateEnemies() {
    Length = EnemiesArray.length;
    for (var i = 0; i < Length; i++)
    {
        if (EnemiesArray[i] !== undefined) {
            var RandomNumber = (Math.floor(Math.random() * 4));
            if (RandomNumber === 0) {
                EnemiesArray[i].Shoot();
            }

        }
    }
}
function DrawCharacter() {
    ctx.drawImage(Character, Playerx, Playery);
}
function DrawUI() {
    ctx.drawImage(HealthImageUI, 1, 1);
    ctx.font = "10px Arial";
    ctx.fillText("Ammo " + Gun1_Ammo_Count + "/" + Gun1_Clip_Size, 1, 20);
}
function Clear() {
    ctx.clearRect(0, 0, GameCanva.width, GameCanva.height);
}
function UpdateCharacter() {
    if (Collision(Playerx + 5, Playery + 8) === true) {
        IsJumping = false;
    } else {
        Playery += Gravity;
    }
}


function CheckifDead() {
    if (Playery < 0)
    {
        Health--;
        Playerx = StartingPointx;
        Playery = StartingPointy;
        switch (Health) {
            case 3:
                HealthImageUI.src = "ThreeHearts.png";
                break;
            case 2:
                HealthImageUI.src = "TwoHearts.png";
                break;
            case 1:
                HealthImageUI.src = "OneHearts.png";
                break;
            case 0:
                HealthImageUI.src = "";
                alert("You lost");
                sleep(5000);
                break;
        }
    }
}

Initilize();
function GameCycle() {
    Clear();
    DrawTerrain();
    DrawUI();
    KeyHandler();
    UpdateCharacter();
    DrawBullets();
    DrawEnemies();
    UpdateEnemies();
    DrawCharacter();
    CheckifDead();
}
function PauseGameCycle() {
    clearInterval(GameCycleId);
}
$(document).ready(function () {
    $(".PlayButton").click(function () {
        document.getElementById("GameAreaDiv").style.display = "block";
        document.getElementById("ControlsDiv").style.display = "none";
        document.getElementById("MenuDiv").style.display = "none";
        GameCycleId = setInterval(function () {
            GameCycle();
        }, 100);
    });
});
$(document).ready(function () {
    $("#ControlsButton").click(function () {
        document.getElementById("ControlsDiv").style.display = "block";
        document.getElementById("MenuDiv").style.display = "none";
    });
});
$(document).ready(function () {
    $("#MenuButton").click(function () {
        document.getElementById("ControlsDiv").style.display = "none";
        document.getElementById("MenuDiv").style.display = "block";
    });
});
$(document).ready(function () {
    $("#pause").click(function () {

        if (switching === false)
        {
            clearInterval(GameCycleId);
            document.getElementById("fadeDiv").style.display = "block";
            switching = true;
        } else {
            GameCycleId = setInterval(function () {
                GameCycle();
            }, 100);
            document.getElementById("fadeDiv").style.display = "none";
            switching = false;
        }
    });
});