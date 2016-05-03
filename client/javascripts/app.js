

var mm = function () {
    var self = this;
    self.descriptionToAdd = ko.observable("");
    self.tag = ko.observable("");

    self.showForm = ko.observable(false);
    self.showContent = ko.observable(true);

    self.showForm.subscribe(function () {
        self.showContent(!self.showForm())
    })

    self.showTag = ko.observable(false);

    self.list = ko.observableArray([]);
    self.reversed = false;


    self.tabs = [
        { name: "Newest", showForm: false,active:ko.observable(true) },
        { name: "Oldest", showForm: false,active:ko.observable(false) },
        { name: "Tags", showForm: false,active:ko.observable(false) },
        { name: "Add", showForm: true,active:ko.observable(false) }
    ]
    self.add = function () {
        var newToDo = { description: self.descriptionToAdd(), tags: self.tag().split(',') };

        $.post("todos", newToDo, self.result);
    }

    self.activateTab = function (selectedTab) {
        self.showForm(selectedTab.showForm);
        self.showTag(false)
        
        self.tabs.map(function(item){
            if(item.name == selectedTab.name){
                item.active(true)
            }else{
                 item.active(false);
            }
        })

        if (selectedTab.name == "Oldest") {
            if (self.reversed == true) { 
                self.list.reverse(); 
                self.reversed = false
            }
        } else if (selectedTab.name == "Newest") {
            if (self.reversed == false) {
                self.list.reverse();
                self.reversed = true
            }

        } else if (selectedTab.name == "Tags") {
            self.showTag(true)
            console.log(self.showTag())
        } else {

        }
        var data = self.list();
        self.list([]);
        data.map(function (item) {
            self.list.push(item);
        })
    }

    self.init = function () {
        $.get("todos.json", {}, self.result);

      
    }

    self.result = function (result) {
        self.list([]);

        result.map(function (item) {
            self.list.push(item)
        })

        self.descriptionToAdd('');
        self.tag('');
    }

    self.init();
}

$(document).ready(function () {
    ko.applyBindings(new mm());
})
