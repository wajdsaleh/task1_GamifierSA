const flipCardWrapAll = document.querySelector("#flip-card-wrap-all")
const cardsWrapper = document.querySelectorAll(".flip-card-3D-wrapper")
const Cards = document.querySelectorAll(".flip-card")
let frontButtons = ""
let backButtons = ""

for (let i = 0; i < cardsWrapper.length; i++) {
frontButtons = cardsWrapper[i].querySelector(".flip-card-btn-turn-to-back")
frontButtons.style.visibility = "visible"
frontButtons.onclick = function() {
Cards[i].classList.toggle('do-flip')
}
  
backButtons = cardsWrapper[i].querySelector(".flip-card-btn-turn-to-front")
backButtons.style.visibility = "visible"
backButtons.onclick = function() {
Cards[i].classList.toggle('do-flip')
 }  
}


var cards = [
    document.getElementById("card1"),
    document.getElementById("card2"),
    document.getElementById("card3"),
    document.getElementById("card4"),
    document.getElementById("card5")  
  ];
  
  // Math Additions
  if (!Math.degreesToRadians) {
      Math.degreesToRadians = function (degrees) {
          return degrees * (Math.PI / 180);
      };
  }
  
  if (!Math.radiansToDegrees) {
      Math.radiansToDegrees = function (radians) {
          return radians * (180 / Math.PI);
      };
  }
  
  if (!Math.getRotatedDimensions) {
      Math.getRotatedDimensions = function (angle_in_degrees, width, height) {
          var angle = angle_in_degrees * Math.PI / 180,
              sin   = Math.sin(angle),
              cos   = Math.cos(angle);
          var x1 = cos * width,
              y1 = sin * width;
          var x2 = -sin * height,
              y2 = cos * height;
          var x3 = cos * width - sin * height,
              y3 = sin * width + cos * height;
          var minX = Math.min(0, x1, x2, x3),
              maxX = Math.max(0, x1, x2, x3),
              minY = Math.min(0, y1, y2, y3),
              maxY = Math.max(0, y1, y2, y3);
  
          return [ Math.floor((maxX - minX)), Math.floor((maxY - minY)) ];
      };
  }
  
  if (!Math.rotatePointInBox) {
      Math.rotatePointInBox = function (x, y, angle, width, height) {
          angle = Math.degreesToRadians(angle);
  
          var centerX = width / 2.0;
          var centerY = height / 2.0;
          var dx = x - centerX;
          var dy = y - centerY;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var a =  Math.atan2(dy, dx) + angle;
          var dx2 = Math.cos(a) * dist;
          var dy2 = Math.sin(a) * dist;
  
          return [ dx2 + centerX, dy2 + centerY ];
      };
  }
  
  var options = {
    spacing: 0.3, // How much to show between cards, expressed as percentage of textureWidth
    radius: 300, // This is the radius of the circle under the fan of cards and thus controls the overall curvature of the fan. Small values means higher curvature
    flow: "horizontal", // The layout direction (horizontal or vertical)
    fanDirection: "N",
    imagesUrl: "cards/" // The base URL for the card images, should end with a '/'.
  };
  
  
  fanCards(cards, this, options);
  
  function fanCards(cards, self, options) {
    var n = cards.length;
    if (n === 0) {
      return;
    }
  
    var width = options.width || cards[0].clientWidth || 90; // hack: for a hidden hand
    var height = cards[0].clientHeight || Math.floor(width * 1.4); // hack: for a hidden hand
    console.log("height: ", height)
    var box = {};
    var coords = calculateCoords(
      n,
      options.radius,
      width,
      height,
      options.fanDirection,
      options.spacing,
      box
    );
  
    var hand = (cards[0]).parentElement;
    hand.style.width = box.width+"px";
    hand.style.height = box.height+"px";
  
    var i = 0;
    console.log(">>>>> ", coords)
    coords.forEach(function (coord) {
      var card = cards[i++];
      gsap.to(card, {left: coord.x+"px", top: coord.y+"px", duration: 0.5})
      card.onmouseenter = function () {
        gsap.to(card, {top: (coord.y - 20)+"px", zIndex: 99, duration: 0.15})
      };
      card.onmouseleave = function () {
        gsap.to(card, {top: (coord.y)+"px", zIndex: 0, duration: 0.10, delay: 0.15})
      };
      var rotationAngle = Math.round(coord.angle);
      var prefixes = ["Webkit", "Moz", "O", "ms"];
      prefixes.forEach(function (prefix) {
        gsap.to(card, {rotation: rotationAngle+"_short", duration: 0.8})
      });
    });
  }
  
  function cardSetTop(card, top, onTop){
    card.style.top = top + "px";
    if(onTop){
    card.style.zIndex = 99;
    }
    else {
      card.style.zIndex = 0;
    }
  }
  
  function calculateCoords(
    numCards,
    arcRadius,
    cardWidth,
    cardHeight,
    direction,
    cardSpacing,
    box
  ) {
    // The separation between the cards, in terms of rotation around the circle's origin
    var anglePerCard = Math.radiansToDegrees(
      Math.atan((cardWidth * cardSpacing) / arcRadius)
    );
  
    var angleOffset = { N: 270, S: 90, E: 0, W: 180 }[direction];
  
    var startAngle = angleOffset - 0.5 * anglePerCard * (numCards - 1);
    console.log(anglePerCard)
    var coords = [];
    var i;
    var minX = 99999;
    var minY = 99999;
    var maxX = -minX;
    var maxY = -minY;
    for (i = 0; i < numCards; i++) {
      var degrees = startAngle + anglePerCard * i;
  
      var radians = Math.degreesToRadians(degrees);
      var x = cardWidth / 2 + Math.cos(radians) * arcRadius;
      var y = cardHeight / 2 + Math.sin(radians) * arcRadius;
  
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      
      console.log("-------------------------------");
      console.log(minX, minY, maxX, maxY, degrees+90);
      
      coords.push({ x: x, y: y, angle: degrees + 90 });
    }
  
    var rotatedDimensions = Math.getRotatedDimensions(
      coords[0].angle,
      cardWidth,
      cardHeight
    );
  
    var offsetX = 0;
    var offsetY = 0;
  
    if (direction === "N") {
      offsetX = minX * -1;
      offsetX += (rotatedDimensions[0] - cardWidth) / 2;
  
      offsetY = minY * -1;
    } else if (direction === "S") {
      offsetX = minX * -1;
      offsetX += (rotatedDimensions[0] - cardWidth) / 2;
  
      offsetY = (minY + (maxY - minY)) * -1;
    } else if (direction === "W") {
      offsetY = minY * -1;
      offsetY += (rotatedDimensions[1] - cardHeight) / 2;
  
      offsetX = minX * -1;
      offsetX +=
        cardHeight - Math.rotatePointInBox(0, 0, 270, cardWidth, cardHeight)[1];
    } else if (direction === "E") {
      offsetY = minY * -1;
      offsetY += (rotatedDimensions[1] - cardHeight) / 2;
  
      offsetX = arcRadius * -1;
      offsetX -=
        cardHeight - Math.rotatePointInBox(0, 0, 270, cardWidth, cardHeight)[1];
    }
  
    coords.forEach(function (coord) {
      coord.x += offsetX;
      coord.x = Math.round(coord.x);
  
      coord.y += offsetY;
      coord.y = Math.round(coord.y);
  
      coord.angle = Math.round(coord.angle);
    });
  
    box.width = coords[numCards - 1].x + cardWidth;
    box.height = coords[numCards - 1].y + cardHeight;
  
    
    return coords;
  }

