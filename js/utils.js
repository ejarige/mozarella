function getPnj(){
        // type pnj : plat/price/plat+price
        var type = getRand(1,5);

        var getRandPrice = function(){
            var prices = [];
            var i = 0;
            for(var r in restos){
                for(var p=Math.ceil(restos[r].priceMin);p<=Math.ceil(restos[r].priceMax) && p<=20;p++, i++){
                    prices[i] = p;
                }
            }

            var price = Phaser.ArrayUtils.getRandomItem(prices);
            var results = [];

            for(var r in restos){
                if(price >= restos[r].priceMin && price <= restos[r].priceMax){
                    results.push(restos[r]);
                }
            }

            return {price: price,results: results};
        };

        var getRandFood = function(){
            var foods = [];
            var i = 0;
            for(var r in restos){
                for(var f in restos[r].food){
                    foods[i] = restos[r].food[f];
                    i++;
                }
            }

            var food = Phaser.ArrayUtils.getRandomItem(foods);
            var results = [];

            for(var r in restos){
                if(~restos[r].food.indexOf(food)){
                    results.push(restos[r]);
                }
            }

            return {food: food,results: results};
        };

        var getRandFoodAndPrice = function(){
            var priceAll = getRandPrice();
            var foods = [];

            var i = 0;
            for(var r in priceAll.results){
                for(var f in priceAll.results[r].food){
                    foods[i] = priceAll.results[r].food[f];
                    i++;
                }
            }

            var price   = priceAll.price;
            var food    = Phaser.ArrayUtils.getRandomItem(foods);
            var results = [];

            for(var r in restos){
                if(price >= restos[r].priceMin && price <= restos[r].priceMax && ~restos[r].food.indexOf(food)){
                    results.push(restos[r]);
                }
            }

            return {price: price, food: food,results: results};
        };

        switch(type){
            case 1  : return getRandFood(); break;
            case 2  : return getRandPrice(); break;
            default : return getRandFoodAndPrice(); break;
        }
}

function getRand(min, max){
    return Math.floor(Math.random() * (max+1 - min) + min);
}