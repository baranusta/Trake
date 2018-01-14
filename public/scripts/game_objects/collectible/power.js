class Power extends Collectible{
    constructor(center){
        if (new.target === Node) throw TypeError("new of abstract class Node");

        super(center);
        this.color = vec4(1.0, 0.0, 1.0, 1.0);
        this.leftPower = 1;
    }

    usePower(usePowerFunc, removePowerFunc){    
        if(this.leftPower > 0){
            usePowerFunc();
            if(this.leftPower == 0){
                removePowerFunc();
                this.clean();
            }
        }
    }

    clean(){
        // modify view
    }

    stop(snake){
        
    }
}