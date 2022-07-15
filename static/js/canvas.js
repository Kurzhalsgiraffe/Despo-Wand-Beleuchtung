class CanvasObject {
    constructor(canvas, FRAME_HEIGHT, FRAME_WIDTH, PIXEL_SIZE, colorArray=[], gridColor="rgba(255, 255, 255, 1.0)") {
        this.FRAME_HEIGHT = FRAME_HEIGHT;
        this.FRAME_WIDTH = FRAME_WIDTH;
        this.PIXEL_SIZE = PIXEL_SIZE;
        this.gridColor = gridColor;
        this.colorArray = colorArray;
        this.currentPos = 1;
        this.setColorArray(colorArray);
        
        if (canvas != null) {
            this.setCanvas(canvas);
        }
        
        //(x_coord, y_coord, index)
        this.matrix = [[0,0,0], [0,1,1], [0,2,2], [0,3,3], [0,4,4], [0,5,5], [0,6,6],
                        [1,1,7], [1,2,8],[1,3,9], [1,4,10], [1,5,11], [1,6,12],
                        [2,3,13], [2,4,14], [2,5,15], [2,6,16],
                        [3,3,17], [3,4,18], [3,5,19], [3,6,20],
                        [4,3,21], [4,4,22], [4,5,23],
                        [5,3,24], [5,4,25], [5,5,26], [5,6,27],
                        [6,3,28], [6,4,29], [6,5,30], [6,6,31],
                        [7,1,32], [7,2,33], [7,3,34], [7,4,35], [7,5,36], [7,6,37],
                        [8,0,38], [8,1,39], [8,2,40], [8,3,41], [8,4,42], [8,5,43], [8,6,44]]
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.c = this.canvas.getContext("2d");
        this.c.fillStyle = "#ffffff";
    }

    setColorArray(colorArray) {
        this.colorArray = colorArray;
    }

    drawColorArrayToCanvas() {
        for (let tuple of this.matrix) {
            let x_coord = tuple[0]
            let y_coord = tuple[1]
            let index = tuple[2]
            this.c.fillStyle = this.colorArray[index];

            this.draw(this.PIXEL_SIZE*x_coord, this.PIXEL_SIZE*y_coord);
        }
        this.drawGrid();
    }

    draw(x_start, y_start) {
        this.c.strokeStyle = this.c.fillStyle;
        this.c.beginPath();
        this.c.rect(x_start, y_start, this.PIXEL_SIZE, this.PIXEL_SIZE);
        this.c.fill();
        this.c.stroke();
        this.updateGrid(x_start,y_start);
    }

    initializeColorArray() {
        for (let i=0; i<45;i++) {
            this.colorArray[i] = "#000000";
        }
    }

    drawGrid() {
        for (let tuple of this.matrix) {
            let x_coord = tuple[0]
            let y_coord = tuple[1]
            
            this.updateGrid(x_coord*this.PIXEL_SIZE, y_coord*this.PIXEL_SIZE);
        }
    }

    updateGrid(x,y) {
        this.c.strokeStyle = this.gridColor;
        this.c.beginPath();
        this.c.rect(x, y, this.PIXEL_SIZE, this.PIXEL_SIZE);
        this.c.stroke();
    }

    async loadColorArrayFromServer(id=null,pos=null) {
        let response
        if (id!=null && pos!=null) {
            response = await fetch("/load/single?image_id="+id+"&pos="+pos);
        } else if(id!=null && pos==null) {
            response = await fetch("/load/single?image_id="+id);
        } else if(id==null && pos!=null) {
            response = await fetch("/load/single?pos="+pos);
        }
        
        let res = await response.json();
        if (response.status == 200) {
            if (res.colorArray) {
                this.colorArray = res.colorArray;
                this.currentPos = res.imageID;  
            } else {
                this.colorArray = []
                this.currentPos = 0
            }       
        } else {
            console.log("failed to load colorArray from server");
        }
    }

    async sendColorArrayToServer(route=null, image_id=null) {
        if (image_id) {
            route = route+"?image_id="+image_id
        }
        let response = await fetch(route, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.colorArray)
        });
        if (response.status != 200) {
            console.log("failed to send colorArray to server");
        }
    }
}