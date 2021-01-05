//Create variables here
var lastFed, foodS, gameState, foodObj, garden, washroom, bedroom, database, foodStock, currentTime, fedTime
function preload()
{
  pet = loadImage("images/dogImg.png")
  pet1 = loadImage("images/dogImg1.png")
  garden = loadImage("virtual pet images/Garden.png")
  bedroom = loadImage("virtual pet images/Bed Room.png")
  washroom = loadImage("virtual pet images/Wash Room.png")
}

function setup() {
  database=firebase.database();
  createCanvas(700,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(pet);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(pet1);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(pet);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}