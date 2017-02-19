var App = function () {
    var that = this;
    var directions = [
        {direction: 'UP', left: findLeft, right: findRight},
        {direction: 'LEFT', left: findBelow, right: findAbove},
        {direction: 'RIGHT', left: findAbove, right: findBelow},
        {direction: 'DOWN', left: findRight, right: findLeft}
    ];
    var currentDirection = 'LEFT';

    function findBelow() {
        var active = $('.active');
        var activeRow = active.closest('tr');
        var nextRow = activeRow.next('tr');

        var index = -1;
        var cells = activeRow.find('td');
        _.some(cells, function (cell) {
            ++index;
            return $(cell).hasClass('active');
        });

        currentDirection = 'DOWN';
        return nextRow.find('td')[index];
    }

    function findRight() {
        currentDirection = 'RIGHT';
        return $('.active').next('td');
    }

    function findLeft() {
        currentDirection = 'LEFT';
        return $('.active').prev('td');
    }

    function findAbove() {
        var active = $('.active');
        var activeRow = active.closest('tr');
        var previousRow = activeRow.prev('tr');

        var index = -1;
        var cells = activeRow.find('td');
        _.some(cells, function (cell) {
            ++index;
            return $(cell).hasClass('active');
        });

        currentDirection = 'UP';
        return previousRow.find('td')[index];
    }

    function turnActive() {
        $('.active').toggleClass('visited');
    }

    that.inc = function () {
        growIfCloseToEdge();

        var visited = $('.active').hasClass('visited');
        var directionActions = _.find(directions, {'direction': currentDirection});
        var action = visited ? directionActions.left : directionActions.right;
        turnActive();

        var next = action();
        $('.active').removeClass('active');
        $(next).addClass('active');

        setTimeout(that.inc, 50);
    };

    function growIfCloseToEdge() {
        var nearLeft = $('.active').prev('td').prev('td').length === 0;
        var nearRight = $('.active').next('td').next('td').length === 0;
        var nearTop = $('.active').closest('tr').prev('tr').prev('tr').length === 0;
        var nearBottom = $('.active').closest('tr').next('tr').next('tr').length === 0;

        if (nearLeft) {
            _.forEach($('table tr'), function (row) {
                $('td').first().clone().addClass('new').hide().prependTo(row);
            });
        } else if (nearRight) {
            _.forEach($('table tr'), function (row) {
                $('td').first().clone().addClass('new').hide().appendTo(row);
            });
        } else if (nearTop) {
            $('table tr').first().clone().addClass('new').hide().prependTo('table');
        } else if (nearBottom) {
            $('table tr').first().clone().addClass('new').hide().appendTo('table');
        }

        $('.new').show();
        $('.new').removeClass('new');
    }

    function grow() {
        $('table tr').first().clone().addClass('new').hide().prependTo('table');
        $('table tr').first().clone().addClass('new').hide().appendTo('table');

        _.forEach($('table tr'), function (row) {
            $('td').first().clone().addClass('new').hide().prependTo(row);
            $('td').first().clone().addClass('new').hide().appendTo(row);
        });

        $('.new').show();
        $('.new').removeClass('new');
    }

    that.start = function () {
        grow();
        that.inc();
    };

    return that;
};

$(function () {
    var app = new App();
    app.start();
});