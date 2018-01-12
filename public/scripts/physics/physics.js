class Physics {
    static parameterCheck(outer, inner) {
        //console.log(outer.sizeX);
        if (!!outer && !!inner && outer instanceof Box && inner instanceof Box)
            return true;
        return false;
    }

    static isCompletelyInside(outer, inner) {
        if(this.parameterCheck(outer, inner)){
            if(outer.center[0] - outer.size[0]/2.0 < inner.center[0] - inner.size[0]/2.0 && 
                outer.center[0] + outer.size[0]/2.0 > inner.center[0] + inner.size[0]/2.0 && 
                outer.center[1] - outer.size[1]/2.0 < inner.center[1] - inner.size[1]/2.0 && 
                outer.center[1] + outer.size[1]/2.0 > inner.center[1] + inner.size[1]/2.0)
                return true;
            return false;
        }
        return false;
    }

    static isCompletelyOutside(outer, inner) {
        if(this.parameterCheck(outer, inner)){
            if(outer.center[0] - outer.size[0]/2.0 > inner.center[0] + inner.size[0]/2.0 || 
                outer.center[0] + outer.size[0]/2.0 < inner.center[0] - inner.size[0]/2.0 || 
                outer.center[1] - outer.size[1]/2.0 > inner.center[1] + inner.size[1]/2.0 || 
                outer.center[1] + outer.size[1]/2.0 < inner.center[1] - inner.size[1]/2.0)
                return true;
            return false;
        }
        return false;
    }

    static isColliding(outer, inner) {
        return this.parameterCheck(outer, inner) && !this.isCompletelyOutside(outer, inner);
    }

};

class Box {
    constructor(center, size) {
        this.center = center; 
        this.size = size; 
        // this.xMin = center[0] - size[0]/2.0;
        // this.yMin = center[1] - size[1]/2.0;
        // this.xMax = center[0] + size[0]/2.0;
        // this.yMax = center[1] + size[1]/2.0;
    }
}