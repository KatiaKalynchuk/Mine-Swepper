
function Point() { //класс ячейка
    this.isMine = false; //стоит ли мина
    this.mineAround = 0; //мин рядом
    this.isOpen = false; //открыта ли
}

var game = { //обьект игра
    fillField: function () { //метод заполнения поля
        MinesweeperModel.options.field = []; //очистка поля
        for (var i = 0; i < MinesweeperModel.options.width; i++){ //проходим по колонкам
            var tmp = []; //создаем колонку
            for (var j = 0; j < MinesweeperModel.options.height; j++){ //заполняем ее ячейками
                tmp.push(new Point());
            }
            MinesweeperModel.options.field.push(tmp); //вставляем колонку в поле
        }
        // цикл расстановки мин:
        for (var i = 0; i < MinesweeperModel.options.mineCount;){ // пока не все мины расставлены
            var x = parseInt(Math.random()*MinesweeperModel.options.width - 0.0001); //генерируем координату Х
            var y = parseInt(Math.random()*MinesweeperModel.options.height - 0.0001); //генерируем координату У
            if (!(MinesweeperModel.options.field[x][y].isMine)){ // если сдесь еще нет мины
                MinesweeperModel.options.field[x][y].isMine = true; // ставим мину
                i++;
            }
        }
    },
    mineAroundCounter: function (x, y) { // считает количество мин вокруг ячейки и записывает его в нее
        var xStart = x > 0 ? x-1 : x;
        var yStart = y > 0 ? y-1 : y;
        var xEnd = x < MinesweeperModel.options.width-1 ? x+1 : x;
        var yEnd = y < MinesweeperModel.options.height-1 ? y+1 : y;
        var count = 0;
        for (var i = xStart; i <= xEnd; i++){
            for (var j = yStart; j <= yEnd; j++){
                if (MinesweeperModel.options.field[i][j].isMine && !(x == i && y == j)) count++;
            }
        }
        MinesweeperModel.options.field[x][y].mineAround = count;
    },

    startMineCounter: function () { //пробегает по всем ячейкам и вызывает расчет кол-ва мин рядом
        for (var i = 0; i < MinesweeperModel.options.width; i++) {
            for (var j = 0; j < MinesweeperModel.options.height; j++) {
                this.mineAroundCounter(i, j);
            }
        }
    },

    start: function () { // "новая игра" - пересоздает поле
        MinesweeperModel.options.openCount = 0;
        this.fillField();
        this.startMineCounter();
    },
    restart: function() {
        MinesweeperModel.options.width = document.getElementById('width').value;
        MinesweeperModel.options.height = document.getElementById('height').value;
        MinesweeperModel.options.mineCount = document.getElementById('mines').value;
        MinesweeperModel.options.openCount = 0;
         game.start();
         page.gameInterface.drawField();
    }
};
