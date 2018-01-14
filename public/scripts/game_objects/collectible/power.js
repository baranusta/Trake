class Power extends Collectible{
    constructor(center){
        if (new.target === Node) throw TypeError("new of abstract class Node");

        super(center);
        this.color = vec4(1.0, 0.0, 1.0, 1.0);
        this.name = " ";
        this.setMax(1);
    }

    setMax(max){

        this.max = max;
        this.leftPower = this.max;
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

    apply(snake){
        if(!snake.power){
            $('.game #info #powerUp #name').text(this.name);
            $('.game #info #powerUp #left #left-bar').width( (100.0 * this.leftPower) / (this.max) +'%');
        }
        return false;
    }

    clean(){
        $('.game #info #powerUp #name').text(' ');
    }

    //returns false if power is finished.
    update(){
        this.leftPower--;
        $('.game #info #powerUp #name').text(this.name);
        $('.game #info #powerUp #left #left-bar').width( (100.0 * this.leftPower) / (this.max) +'%');
        return this.leftPower != 0;
    }

    stop(snake){
        
    }
}