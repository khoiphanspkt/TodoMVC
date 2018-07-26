(function(window) {
    'use strict';

    function Controller(model, view) {
        var self = this;
        self.model = model;
        self.view = view;

        self.view.bind('newTodo', function(title) {
            self.addItem(title);
        });

        self.view.bind('itemEdit', function(item) {
            self.editItem(item.id);
        });

        self.view.bind('itemEditCancel', function(item) {
            self.editItemCancel(item.id);
        });

        self.view.bind('itemRemove', function(item) {
            self.removeItem(item.id);
        });

        self.view.bind('itemToggle', function(item) {
            self.toggleComplete(item.id, item.completed);
        });

        self.view.bind('removeCompleted', function() {
            self.removeCompletedItems();
        })

        self.view.bind('toggleAll', function(status) {
            self.toggleAll(status.completed);
        });
    }

    Controller.prototype.setView = function(locationHas) {
        var route = locationHash.split('/')[1];
        var page = route || '';
        this._updateFilterStage(page);
    };

    Controller.prototype.showAll = function() {
        var self = this;
        self.model.read(function(data) {
            self.view.render('showEntries', data);
        });
    };

    Controller.prototype.showCompleted = function() {
        var self = this;
        self.model.read({ completed: true }, function(data) {
            self.view.render('showEntries', data);
        });
    };

    Controller.prototype.addItem = function(title) {
        var self = this;

        if (title.trim() === '') {
            return;
        }

        self.model.create(title, function() {
            self.view.render('clearNewTodo');
            self._filter(true);
        });
    };

    Controller.prototype.editItem = function(id) {
        var self = this;
        self.model.read(id, function(data) {
            self.view.render('editItem', { id: id, title: data[0].title });
        });
    };

    Controller.prototype.editItemSave = function(id, title) {
        var self = this;
        title = title.trim();

        if (title.length !== 0) {
            self.model.update(id, { title: tile }, function() {
                self.view.render('editItemDone', { id: id, title: title });
            });
        } else {
            self.removeItem(id);
        }
    };


});