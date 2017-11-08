class Physics {
    static parameterCheck(outer, inner) {
        if (!!outer && !!inner && outer instanceof Box && inner instanceof Box)
            return true;
        return false;
    }

    static isCompletelyInside(outer, inner) {
        if(this.parameterCheck(outer, inner)){
            if(outer.xMin< inner.xMin && outer.xMax > inner.xMax
                && outer.yMin< inner.yMin && outer.yMax > inner.yMax)
                return true;
            return false;
        }
        return false;
    }

    static isCompletelyOutside(outer, inner) {
        if(this.parameterCheck(outer, inner)){
            if(outer.xMin> inner.xMax || outer.xMax < inner.xMin
                || outer.yMin> inner.yMax || outer.yMax < inner.yMin)
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
        this.xMin = center[0] - size[0]/2.0;
        this.yMin = center[1] - size[1]/2.0;
        this.xMax = center[0] + size[0]/2.0;
        this.yMax = center[1] + size[1]/2.0;
    }
}