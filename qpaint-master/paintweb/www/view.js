class QPaintView {
    constructor() {
        this.style = new QShapeStyle(1, "black", "white")
        this.controllers = {}
        this._currentKey = ""
        this._current = null
        this._selection = null
        this.onmousedown = null
        this.onmousemove = null
        this.onmouseup = null
        this.ondblclick = null
        this.onkeydown = null
        this.onSelectionChanged = null
        this.onControllerReset = null
        let drawing = document.getElementById("drawing")
        let view = this
        drawing.onmousedown = function(event) {
            event.preventDefault();
            if (view.onmousedown != null) {
                view.onmousedown(event);     //Controllers
            }
        }
        drawing.onmousemove = function(event) {
            if (view.onmousemove != null) {
                view.onmousemove(event);     //Controllers
            }
        }
        drawing.onmouseup = function(event) {
            if (view.onmouseup != null) {
                view.onmouseup(event);      //Controllers
            }
        }
        drawing.ondblclick = function(event) {
            event.preventDefault()
            if (view.ondblclick != null) {
                view.ondblclick(event);     //Controllers
            }
        }
        document.onkeydown = function(event) {
            switch (event.keyCode) {
            case 9: case 13: case 27:
                event.preventDefault()
            }
            if (view.onkeydown != null) {
                view.onkeydown(event);      //Controllers
            }
        }
        window.onhashchange = function(event) {
            view.doc.reload()
            view.invalidateRect(null);      //View
        }
        this.drawing = drawing
        this.doc = new QPaintDoc()
        this.doc.init()
        this.invalidateRect(null)
    }

    get currentKey() {      //Controllers
        return this._currentKey
    }
    get selection() {       //Controllers
        return this._selection
    }
    set selection(shape) {      //Controllers
        let old = this._selection
        if (old != shape) {
            this._selection = shape
            if (this.onSelectionChanged != null) {
                this.onSelectionChanged(old);       //Controllers
            }
        }
    }

    getMousePos(event) {        //Controllers
        return {
            x: event.offsetX,
            y: event.offsetY
        }
    }
 
    onpaint(ctx) {      //View
        this.doc.onpaint(ctx)
        if (this._current != null) {
            this._current.onpaint(ctx)
        }
    }

    invalidateRect(reserved) {
        let ctx = this.drawing.getContext("2d")
        let bound = this.drawing.getBoundingClientRect()
        ctx.clearRect(0, 0, bound.width, bound.height)
        this.onpaint(ctx)
    }

    registerController(name, controller) {      //Controllers
        if (name in this.controllers) {
            alert("Controller exists: " + name)
        } else {
            this.controllers[name] = controller
        }
    }
    invokeController(name) {        //Controllers
        this.stopController()
        if (name in this.controllers) {
            let controller = this.controllers[name];   //controller ƒ () {return new QShapeSelector()}
            this._setCurrent(name, controller())
        }
    }
    stopController() {      //Controllers
        if (this._current != null) {
            this._current.stop()
            this._setCurrent("", null)
        }
    }
    fireControllerReset() {     //Controllers
        if (this.onControllerReset != null) {
            this.onControllerReset()        //Controllers
        }
    }

    _setCurrent(name, ctrl) {
        this._current = ctrl;       //ƒ () {return new QShapeSelector()}
        this._currentKey = name;
    }
}

var qview = new QPaintView()

function invalidate(reserved) {
    qview.invalidateRect(null)
}
