;(function(app) {
  app.service('Notebooks', function($rootScope, Factories) {
    function setOpenNotebooks(open) {
      this.openNotebooks = open;
      $rootScope.$broadcast("openNotebookChange");
      return this.openNotebooks;
    }

    function setRecentNotebooks(recent) {
      this.recentNotebooks = recent;
      $rootScope.$broadcast("recentNotebookChange");
      return this.recentNotebooks;
    }

    return {
      setOpenNotebooks: setOpenNotebooks,

      setRecentNotebooks: setRecentNotebooks,

      getOpenNotebooks: function() {
        return this.openNotebooks;
      },

      getRecentNotebooks: function() {
        return this.recentNotebooks;
      },

      update: function(attrs) {
        return Factories.Notebooks.update(attrs).then(function(notebook) {
          this.setOpenNotebooks(_.map(this.getOpenNotebooks(), function(oldNotebook) {
            return (oldNotebook.id == notebook.id) ? notebook : oldNotebook;
          }));
          this.setRecentNotebooks(_.map(this.getRecentNotebooks(), function(oldNotebook) {
            return (oldNotebook.id == notebook.id) ? notebook : oldNotebook;
          }));
          return notebook;
        }.bind(this));
      },

      closeNotebook: function(notebookId) {
        return Factories.Notebooks.close(notebookId).then(function(openNotebooks) {
          setOpenNotebooks.bind(this)(openNotebooks);
          if (frame = document.querySelector("#beaker-frame-"+notebookId)) {
            frame.parentNode.removeChild(frame);
          }
        }.bind(this));
      },

      destroy: function(notebookId) {
        return Factories.Notebooks.destroy(notebookId).then(function() {
          return this.setRecentNotebooks(_.reject(this.getRecentNotebooks(), function(notebook) {
            return notebook.id == notebookId;
          }));
        }.bind(this));
      }
    }
  });
})(window.bunsen);
