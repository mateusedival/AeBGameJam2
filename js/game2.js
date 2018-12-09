var playerVel = 100;
var velCorrection = 7;
 


var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },

    // Fires a bullet from the player to the reticle
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});






var fase1 = new Phaser.Class({
 
    Extends: Phaser.Scene,
 
    initialize:
 
    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },
    preload: function ()
    {
        this.load.image('fundo', 'assets/map/fundo_mp.jpeg');
        
        // map in json format
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');
        
        // our two characters
        this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
        
    },
    create: function ()
    {
        
        this.physics.world.setBounds(0, 0, 500, 350);
        var background = this.add.image(800, 600, 'fundo');

   
        this.player = this.physics.add.sprite(50, 100, 'player', 6);
        this.player.setOrigin(0.5, 0.5).setCollideWorldBounds(true).setDrag(500, 500);
              
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        //this.cameras.main.startFollow(this.player);
        //this.cameras.main.roundPixels = true;
        
        //this.physics.add.collider(this.player, obstacles);
        

        this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        for(var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(0, 450);
            var y = Phaser.Math.RND.between(0, 300);
            // parameters are x, y, width, height
            this.spawns.create(x, y, 20, 20);            
        }        
        this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
        
        
    },
    update: function (time, delta)
    {
        this.player.body.setVelocity(0);

            //deslocaento do personagem
            if (this.cursors.left.isDown)
            {
                if(this.cursors.up.isDown || this.cursors.down.isDown)
                    this.player.body.setVelocityX(-((playerVel/2)+velCorrection));
                else
                    this.player.body.setVelocityX(-playerVel);
            }
            else if (this.cursors.right.isDown)
            {
                if(this.cursors.up.isDown || this.cursors.down.isDown)
                    this.player.body.setVelocityX(((playerVel/2)+velCorrection));
                else
                    this.player.body.setVelocityX(playerVel);
            }
            if (this.cursors.up.isDown)
            {
                if(this.cursors.left.isDown || this.cursors.right.isDown)
                    this.player.body.setVelocityY(-((playerVel/2)+velCorrection));
                else
                    this.player.body.setVelocityY(-playerVel);
            }
            else if (this.cursors.down.isDown)
            {
                if(this.cursors.left.isDown || this.cursors.right.isDown)
                    this.player.body.setVelocityY(((playerVel/2)+velCorrection));
                else
                    this.player.body.setVelocityY(playerVel);
            }
            if (game.input.activePointer.isDown)
            {
                this.fire();
            }
        
    },
    onMeetEnemy: function(player, zone) {        
	   // start battle
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height); 
        
         //this.cameras.main.shake(300);
        
        zone.destroy();
    },
    fire : function(){
        console.log("fogo");
    }
});


function fire(){
    console.log("fogo");
}







 
var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 500,
    height: 350,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug : true
        }
    },
    scene: [
        
        fase1
    ]
};
var game = new Phaser.Game(config);