var App = function () {
    var that = this;
    var sideLength = 3;
    var directions = [
        {direction: 'UP', left: findLeft, right: findRight},
        {direction: 'LEFT', left: findBelow, right: findAbove},
        {direction: 'RIGHT', left: findAbove, right: findBelow},
        {direction: 'DOWN', left: findRight, right: findLeft}
    ];
    var currentDirection = 'LEFT';

    function grow(){
        console.log('table', $('table tr').first() );

        $('table tr').first().clone().addClass('new').hide().prependTo('table');
        $('table tr').first().clone().addClass('new').hide().appendTo('table');

        _.forEach($('table tr'), function(row){
            $('td').first().clone().addClass('new').hide().prependTo(row);
            $('td').first().clone().addClass('new').hide().appendTo(row);
        });

        $('.new').show();
        // $('.new').show('slow');
        $('.new').removeClass('new');
    }

    function findBelow(){
        var active = $('.active');
        var activeRow = active.closest('tr');
        var nextRow = activeRow.next('tr');
        //TODO grow if no previous row

        var index = -1;
        var cells = activeRow.find('td');
        _.some(cells, function(cell){
            ++index;
            return $(cell).hasClass('active');
        });

        currentDirection = 'DOWN';
        return nextRow.find('td')[index];
    }

    function findRight(){
        var right = $('.active').next('td');
        //TODO check found
        currentDirection = 'RIGHT';
        return right;
    }

    function findLeft(){
        var left = $('.active').prev('td');
        //TODO check found
        currentDirection = 'LEFT';
        return left;
    }

    function findAbove(){
        var active = $('.active');
        var activeRow = active.closest('tr');
        var previousRow = activeRow.prev('tr');
        //TODO grow if no previous row

        var index = -1;
        var cells = activeRow.find('td');
        _.some(cells, function(cell){
            ++index;
            return $(cell).hasClass('active');
        });

        console.log('find above index ', index);
        currentDirection = 'UP';
        return previousRow.find('td')[index];
    }

    function turnActive(){
        $('.active').toggleClass('visited')
    }

    that.inc = function () {
        sideLength += 2;
        if(sideLength > 6){
            // console.log('testtttt', $('.active'));

            var visited = $('.active').hasClass('visited');
            // console.log('visited ', visited);
            var directionActions = _.find(directions, {'direction': currentDirection});
            var action = visited ? directionActions.left : directionActions.right;
            // console.log('action', action);
            turnActive();


            var next = action();
            // console.log('next', next);
            $('.active').removeClass('active');
            $(next).addClass('active');

        }else{
            grow();
        }


        if(closeToEdge()){
            grow();
            setTimeout(that.inc, 200);
        }else{
            setTimeout(that.inc, 50);
        }
    };

    function closeToEdge(){
        var nearLeft = $('.active').prev('td').prev('td').length === 0;
        var nearRight = $('.active').next('td').next('td').length === 0;
        var nearTop = $('.active').closest('tr').prev('tr').prev('tr').length === 0;
        var nearBottom = $('.active').closest('tr').next('tr').next('tr').length === 0;

        // console.log(nearBottom || nearTop || nearLeft || nearRight);
        return nearBottom || nearTop || nearLeft || nearRight;
    }

    return that;
};


$(function () {
    var app = new App();
    app.inc();
});