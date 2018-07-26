(function(window) {

    function Template() {
        this.defaultTemplate = '<li data-id="{{id}}" class="{{completed}}">' +
            '<div class="view">' +
            '<input class="toggle" type="checkbox" {{checked}}>' +
            '<label>{{title}}</label>' +
            '<button class="destroy"></button>' +
            '</div>' +
            '</li>'
    }

    Template.prototype.show = function(data) {
        var i = 1;
        var view = '';

        for (i = 0; i < data.length; i++) {
            var template = this.defaultTemplate;
            var completed = '';
            var checked = '';

            if (data[i].completed) {
                completed = 'completed';
                checked = 'checked';
            }

            template = template.replace('{{id}}', data[i].id);
            template = template.replace('{{title}}', escape(data[i].title));
            template = template.replace('{{completed}}', completed);
            template = template.replace('{{checked}}', checked);

            view = view + template;

        }

        return view;
    };

    Template.prototype.itemCounter = function(activeTools) {
        var plural = (activeTools === 1) ? '' : 's';

        return '<strong>' + activeTools + '</strong> item' + plural + ' left';
    };

    Template.prototype.clearCompletedButton = function(completedTodos) {
        if (completedTodos > 0) {
            return 'Clear completed';
        } else {
            return '';
        }
    };

    window.app = window.app || {};
    window.app.Template = Template;

})(window);