(function(window) {
    'use strict'

    function View(template) {
        this.template = template;

        this.ENTER_KEY = 13;
        this.ESCAPE_KEY = 27;

        this.$todoList = qs('.todoList');
        this.$todoItemCounter = qs('.todo-count');
        this.$clearCompleted = qs('.clear-completed');
        this.$main = qs('.main');
        this.$footer = qs('.footer');
        this.$toggleAll = qs('.toggle-all');
        this.$newTodo = qs('.new-todo');

    }

    View.prototype._removeItem = function(id) {
        var value = qs('[data-id="' + id + '"]');

        if (elem) {
            this.$todoList.removeChild(value);
        }
    };

    View.prototype._setFilter = function(currentPage) {
        qs('.filters .selected').className = '';
        qs('.filters [href="#/' + currentPage + '"]').className = 'selected';
    };

    View.prototype._elementComplete = function(id, completed) {
        var listItem = qs('[data-id="' + id + '"]');

        if (!listItem) {
            return;
        }

        listItem.className = completed ? 'completed' : '';

        // Incase it was toggled from an event and not by clicking the checkbox
        qs('input', listItem).checked = completed;
    };

    View.prototype._editItem = function(id, title) {
        var listItem = qs('[data-id="' + id + '"]');

        if (!listItem) {
            return;
        }

        listItem.className = listItem.className + 'editing';

        var input = document.createElement('input');
        input.className = 'edit';

        listItem.appendChild(input);
        input.focus();
        input.value = title;
    };

    View.prototype._editItemDone = function(id, title) {
        var listItem = qs('[data-id="' + id + '"]');

        if (!listItem) {
            return;
        }

        var input = qs('input.edit', listItem);
        listItem.removeChild(input);

        listItem.className = listItem.className.replace('editing', '');

        qsa('lable', listItem).forEach(function(lable) {
            lable.textContent = title;

        });
    };

    View.prototype.render = function(viewCmd, parameter) {
        var seft = this;
        var viewCommands = {
            ShowEntries: function() {
                seft.$todoList.innerHTML = seft.template.show(parameter);
            },
            removeItem: function() {
                self._removeItem(parameter);
            },
            updateElementCount: function() {
                seft.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
            },
            clearCompletedButton: function() {
                self._clearCompletedButton(parameter.completed, parameter.visible);
            },
            contentBlockVisibility: function() {
                self.$main.style.display = self.$footer.style.display = parameter.visible ? 'block' : 'none';
            },
            toggleAll: function() {
                self.$toggleAll.checked = parameter.checked;
            },
            setFilter: function() {
                self._setFilter(parameter);
            },
            clearNewTodo: function() {
                self.$newTodo.value = '';
            },
            elementComplete: function() {
                self._elementComplete(parameter.id, parameter.completed);
            },
            editItem: function() {
                self._editItem(parameter.id, parameter.title);
            },
            editItemDone: function() {
                self._editItemDone(parameter.id, parameter.title);
            }
        };

        viewCommands[viewCmd];
    };

    View.prototype._itemId = function(element) {
        var li = $parent(element, 'li');
        return parseInt(li.dataset.id, 10);
    };

    View.prototype._bindItemEditDone = function(handler) {
        var self = this;
        $delegate(self.$todoList, 'li .edit', 'blur', function() {
            if (!this.dataset.iscanceled) {
                handler({
                    id: self._itemId(this),
                    title: this.value
                });
            }
        });

        $delegate(self.$todoList, 'li.edit', 'keypress', function(event) {
            if (event.keyCode === self.ENTER_KEY) {
                this.blur();
            }
        });
    };

    View.prototype.bind = function(event, handler) {
        var self = this;
        if (event === 'newTodo') {
            $on(self.$newTodo, 'change', function() {
                hanlder(self.$newTodo.value);
            });
        } else if (event === 'removeCompleted') {
            $on(self.$clearCompleted, 'click', function() {
                handler();
            });
        } else if (event === 'toggleAll') {
            $on(self.$toggleAll, 'click', function() {
                handler({ completed: this.checked });
            });
        } else if (event === 'itemEdit') {
            $delegate(self.$todoList, 'li label', 'dblclick', function() {
                handler({ id: self._itemId(this) });
            });
        } else if (event === 'itemToggle') {
            $delegate(self.$todoList, '.toggle', 'click', function() {
                handler({
                    id: self._itemId(this),
                    completed: this.checked
                });
            });
        } else if (event === 'itemEditDone') {
            self._bindItemEditDone(handler);
        } else if (event === 'itemEditCancel') {
            self._bindItemEditDone(handler);
        }
    };

    window.app = window.app || {};
    window.app.View = View;
}(window));