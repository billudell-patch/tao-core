define([
    'jquery',
    'ui/class/selector',
    'provider/resources',
    'tpl!controller/Move/destination'
],  function($, classSelectorFactory, resourceProviderFactory, destinationTpl){
    'use strict';

    return {

        start : function start(){
            var resourceProvider = resourceProviderFactory();
            $('.form-content').html(destinationTpl());

            resourceProvider.getClasses('http://www.tao.lu/Ontologies/TAOItem.rdf#Item')
                .then(function(classes) {

                    classSelectorFactory($('.class-selector-container'), {
                        classes : classes
                    })
                })
                .catch(function(err){
                    console.error(err);
                });
        }
    }
});