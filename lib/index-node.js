var lymph = function() {
    var modules = {};
    return {
        define: function(name, moduleFN) {
            modules[name] = moduleFN;
        },
        require: function(name) {
            return modules[name](require);
        }
    };
}();

lymph.require("server/main")();//@ sourceMappingURL=index-node.js.map