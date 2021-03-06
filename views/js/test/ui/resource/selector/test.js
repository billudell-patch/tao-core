/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA ;
 */

/**
 * Test the ui/resource/selector module
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery',
    'lodash',
    'ui/resource/selector',
    'json!test/ui/resource/selector/classes.json',
    'json!test/ui/resource/tree/root.json',
    'json!test/ui/resource/tree/node.json',
    'json!test/ui/resource/list/nodes.json',
], function($, _, resourceSelectorFactory, classesData, treeRootData, treeNodeData, listData) {
    'use strict';

    var labelUri = 'http://www.w3.org/2000/01/rdf-schema#label';
    var modes = resourceSelectorFactory.selectionModes;

    QUnit.module('API');

    QUnit.test('module', function(assert) {
        QUnit.expect(3);

        assert.equal(typeof resourceSelectorFactory, 'function', "The resourceSelectorFactory module exposes a function");
        assert.equal(typeof resourceSelectorFactory(), 'object', "The resourceSelectorFactory produces an object");
        assert.notStrictEqual(resourceSelectorFactory(), resourceSelectorFactory(), "The resourceSelectorFactory provides a different object on each call");
    });

    QUnit.cases([
        { title : 'init' },
        { title : 'destroy' },
        { title : 'render' },
        { title : 'show' },
        { title : 'hide' },
        { title : 'enable' },
        { title : 'disable' },
        { title : 'is' },
        { title : 'setState' },
        { title : 'getContainer' },
        { title : 'getElement' },
        { title : 'getTemplate' },
        { title : 'setTemplate' },
    ]).test('Component API ', function(data, assert) {
        var instance = resourceSelectorFactory();
        assert.equal(typeof instance[data.title], 'function', 'The resourceSelector exposes the component method "' + data.title);
    });

    QUnit.cases([
        { title : 'on' },
        { title : 'off' },
        { title : 'trigger' },
        { title : 'before' },
        { title : 'after' },
    ]).test('Eventifier API ', function(data, assert) {
        var instance = resourceSelectorFactory();
        assert.equal(typeof instance[data.title], 'function', 'The resourceSelector exposes the eventifier method "' + data.title);
    });

    QUnit.cases([
        { title : 'query' },
        { title : 'update' },
        { title : 'reset' },
        { title : 'empty' },
        { title : 'getSelection' },
        { title : 'clearSelection' },
        { title : 'changeFormat' },
        { title : 'getSearchQuery' },
        { title : 'setSearchQuery' },
        { title : 'changeSelectionMode' },
    ]).test('Instance API ', function(data, assert) {
        var instance = resourceSelectorFactory();
        assert.equal(typeof instance[data.title], 'function', 'The resourceSelector exposes the method "' + data.title);
    });


    QUnit.module('Behavior');

    QUnit.asyncTest('Lifecycle', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(2);

        resourceSelectorFactory($container, {
            classUri : 'http://www.tao.lu/Ontologies/TAOItem.rdf#Item',
            classes : classesData
        })
        .on('init', function(){
            assert.ok( !this.is('rendered'), 'The component is not yet rendered');
        })
        .on('render', function(){

            assert.ok(this.is('rendered'), 'The component is now rendered');

            this.destroy();
        })
        .on('destroy', function(){

            QUnit.start();
        });
    });

    QUnit.asyncTest('multiple selection rendering', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(12);

        assert.equal($('.resource-selector', $container).length, 0, 'No resource tree in the container');

        resourceSelectorFactory($container, {
            classUri : 'http://www.tao.lu/Ontologies/TAOItem.rdf#Item',
            selectionMode : modes.multiple,
            classes : classesData
        })
        .after('render', function(){

            var $element = this.getElement();

            assert.equal($('.resource-selector', $container).length, 1, 'The component has been inserted');
            assert.equal($('.resource-selector', $container)[0], $element[0], 'The component element is correct');

            assert.equal($('.context', $element).length, 1, 'The component has the context toolbar');
            assert.equal($('.context .class-selector.rendered', $element).length, 1, 'The component has the class selector');

            assert.equal($('.context [data-view-format]', $element).length, 2, 'The component has 2 format switchers');

            assert.equal($('.selection', $element).length, 1, 'The component has the selection toolbar');
            assert.equal($('.selection .search input', $element).length, 1, 'The component has the pattern input');
            assert.equal($('.selection .selection-control input', $element).length, 1, 'The component has the selection control');
            assert.ok( ! $('.selection .selection-control label', $element).hasClass('hidden'), 'The selection control is displayed');

            assert.equal($('main', $element).length, 1, 'The component has the viewer container');
            assert.equal($('footer .get-selection', $element).length, 1, 'The component has the selection indicator');

            QUnit.start();
        });
    });

    QUnit.asyncTest('single selection rendering', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(12);

        assert.equal($('.resource-selector', $container).length, 0, 'No resource tree in the container');

        resourceSelectorFactory($container, {
            classUri : 'http://www.tao.lu/Ontologies/TAOItem.rdf#Item',
            selectionMode : modes.single,
            classes : classesData
        })
        .after('render', function(){

            var $element = this.getElement();

            assert.equal($('.resource-selector', $container).length, 1, 'The component has been inserted');
            assert.equal($('.resource-selector', $container)[0], $element[0], 'The component element is correct');

            assert.equal($('.context', $element).length, 1, 'The component has the context toolbar');
            assert.equal($('.context .class-selector.rendered', $element).length, 1, 'The component has the class selector');

            assert.equal($('.context [data-view-format]', $element).length, 2, 'The component has 2 format switchers');

            assert.equal($('.selection', $element).length, 1, 'The component has the selection toolbar');
            assert.equal($('.selection .search input', $element).length, 1, 'The component has the pattern input');
            assert.equal($('.selection .selection-control input', $element).length, 1, 'The component has the selection control');
            assert.ok($('.selection .selection-control label', $element).hasClass('hidden'), 'The selection control is hidden');

            assert.equal($('main', $element).length, 1, 'The component has the viewer container');
            assert.equal($('footer .get-selection', $element).length, 0, 'The component has no selection indicator');

            QUnit.start();
        });
    });

    QUnit.asyncTest('format change', function(assert) {
        var $container = $('#qunit-fixture');
        var config = {
            classUri : 'http://www.tao.lu/Ontologies/TAOItem.rdf#Item',
            classes : classesData
        };

        QUnit.expect(12);

        assert.equal($('.resource-selector', $container).length, 0, 'No resource tree in the container');

        resourceSelectorFactory($container, config)
            .on('update.foo', function(){
                var $element = this.getElement();
                var $treeSwitch = $('[data-view-format=tree]', $element);
                var $listSwitch = $('[data-view-format=list]', $element);

                this.off('update.foo');

                assert.equal($listSwitch.length, 1, 'The list format switch is available');
                assert.equal($listSwitch.hasClass('active'), false, 'The list format switch is not active');
                assert.equal($treeSwitch.length, 1, 'The tree format switch is available');
                assert.equal($treeSwitch.hasClass('active'), true, 'The list format switch is active');

                assert.equal($('main .resource-tree', $element).length, 1, 'The resource tree is enabled');
                assert.equal($('main .resource-list', $element).length, 0, 'The resource list is not there');


                this.on('formatchange', function(newFormat){
                    assert.equal(newFormat, 'list', 'the format has changed');
                    assert.equal($listSwitch.hasClass('active'), true, 'The list format switch is now active');
                    assert.equal($treeSwitch.hasClass('active'), false, 'The list format switch is not active');
                });
                this.on('update', function(){

                    assert.equal($('main .resource-tree', $element).length, 0, 'The resource tree ihas been removed');
                    assert.equal($('main .resource-list', $element).length, 1, 'The resource list is now enabled');

                    QUnit.start();
                });

                $listSwitch.click();
            })
            .on('query', function(params){
                if(params.format === 'tree'){
                    if(config.classUri === params.classUri){
                        this.update(treeRootData, params);
                    } else {
                        this.update(treeNodeData, params);
                    }
                }
                if(params.format === 'list'){
                    this.update(listData, params);
                }
            });
    });

    QUnit.asyncTest('multiple selection', function(assert) {
        var $container = $('#qunit-fixture');
        var config = {
            classUri : 'http://www.tao.lu/Ontologies/TAOItem.rdf#Item',
            selectionMode : modes.multiple,
            classes : classesData,
            format : 'list'
        };

        QUnit.expect(28);

        assert.equal($('.resource-selector', $container).length, 0, 'No resource tree in the container');

        resourceSelectorFactory($container, config)
            .on('update', function(){
                var $control = $('.selection-control input', this.getElement());
                var $node1 = $('[data-uri="http://bertao/tao.rdf#i14918988138981105"]', this.getElement());
                var $node2 = $('[data-uri="http://bertao/tao.rdf#i14918988538969120"]', this.getElement());

                var selection = this.getSelection();

                assert.equal($control.length, 1, 'The selection control exists');
                assert.equal($control.prop('indeterminate'), false, 'hThe selection control says no values');
                assert.equal($control.prop('checked'), false, 'The selection control says no values');

                assert.equal($node1.length, 1, 'node2 exists');
                assert.ok(! $node1.hasClass('selected'), 'node2 is not selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i1491898801542197'], 'undefined', 'The selection does not contain node1');

                assert.equal($node2.length, 1, 'node1 exists');
                assert.ok(! $node2.hasClass('selected'), 'node1 is not selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988061562101'], 'undefined', 'The selection does not contain noder2');

                $node1.click();
                $node2.click();

                selection = this.getSelection();

                assert.equal($control.prop('indeterminate'), true, 'The selection control says some values');
                assert.equal($control.prop('checked'), false, 'The selection control says some values');

                assert.ok($node1.hasClass('selected'), 'node1 is now selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988138981105'], 'object', 'The selection contains node1');

                assert.ok($node2.hasClass('selected'), 'node2 is now selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988538969120'], 'object', 'The selection contains node2');

                this.clearSelection();
                selection = this.getSelection();

                assert.equal($control.prop('indeterminate'), false, 'The selection control says no values');
                assert.equal($control.prop('checked'), false, 'The selection control says no values');

                assert.ok(! $node1.hasClass('selected'), 'node1 is not selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i1491898801542197'], 'undefined', 'The selection does not contain node1');

                assert.ok(! $node2.hasClass('selected'), 'node2 is not selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988538969120'], 'undefined', 'The selection does not contain node2');

                $control.click();
                selection = this.getSelection();

                assert.equal($control.prop('indeterminate'), false, 'The selection control says all  values');
                assert.equal($control.prop('checked'), true, 'The selection control says all values');

                assert.ok($node1.hasClass('selected'), 'node1 is now selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988138981105'], 'object', 'The selection contains node1');

                assert.ok($node2.hasClass('selected'), 'node2 is now selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988538969120'], 'object', 'The selection contains node2');

                QUnit.start();
            })
            .on('query', function(params){
                this.update(listData, params);
            });
    });


    QUnit.asyncTest('single selection', function(assert) {
        var $container = $('#qunit-fixture');
        var config = {
            classUri : 'http://www.tao.lu/Ontologies/TAOItem.rdf#Item',
            selectionMode : modes.single,
            classes : classesData,
            format : 'list'
        };

        QUnit.expect(19);

        assert.equal($('.resource-selector', $container).length, 0, 'No resource tree in the container');

        resourceSelectorFactory($container, config)
            .on('update', function(){
                var $node1 = $('[data-uri="http://bertao/tao.rdf#i14918988138981105"]', this.getElement());
                var $node2 = $('[data-uri="http://bertao/tao.rdf#i14918988538969120"]', this.getElement());

                var selection = this.getSelection();

                assert.equal($node1.length, 1, 'node1 exists');
                assert.ok(! $node1.hasClass('selected'), 'node1 is not selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988138981105'], 'undefined', 'The selection does not contain node1');

                assert.equal($node2.length, 1, 'node2 exists');
                assert.ok(! $node2.hasClass('selected'), 'node2 is not selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988538969120'], 'undefined', 'The selection does not contain node2');

                $node1.click();

                selection = this.getSelection();

                assert.ok($node1.hasClass('selected'), 'node1 is now selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988138981105'], 'object', 'The selection contains node1');

                assert.ok(! $node2.hasClass('selected'), 'node2 is not selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988538969120'], 'undefined', 'The selection does not contain node2');

                this.clearSelection();
                selection = this.getSelection();

                assert.ok(! $node1.hasClass('selected'), 'node1 is not selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988138981105'], 'undefined', 'The selection does not contain node1');

                assert.ok(! $node2.hasClass('selected'), 'node2 is not selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988538969120'], 'undefined', 'The selection does not contain node2');

                $node1.click();
                $node2.click();
                selection = this.getSelection();

                assert.ok(! $node1.hasClass('selected'), 'node1 is not selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988138981105'], 'undefined', 'The selection does not contain node1');

                assert.ok($node2.hasClass('selected'), 'node2 is now selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988538969120'], 'object', 'The selection contains node2');

                QUnit.start();
            })
            .on('query', function(params){
                this.update(listData, params);
            });
    });


    QUnit.asyncTest('selection change', function(assert) {
        var $container = $('#qunit-fixture');
        var config = {
            classUri : 'http://www.tao.lu/Ontologies/TAOItem.rdf#Item',
            selectionMode : modes.single,
            classes : classesData,
            format : 'list'
        };

        QUnit.expect(6);

        assert.equal($('.resource-selector', $container).length, 0, 'No resource tree in the container');

        resourceSelectorFactory($container, config)
            .on('change', function(selection){
                var $node1 = $('[data-uri="http://bertao/tao.rdf#i14918988138981105"]', this.getElement());
                assert.ok($node1.hasClass('selected'), 'node1 is now selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988138981105'], 'object', 'The selection contains node1');
                QUnit.start();
            })
            .on('update', function(){
                var $node1 = $('[data-uri="http://bertao/tao.rdf#i14918988138981105"]', this.getElement());

                var selection = this.getSelection();

                assert.equal($node1.length, 1, 'node1 exists');
                assert.ok(! $node1.hasClass('selected'), 'node1 is not selected');
                assert.equal(typeof selection['http://bertao/tao.rdf#i14918988138981105'], 'undefined', 'The selection does not contain node1');
                $node1.click();

            })
            .on('query', function(params){
                this.update(listData, params);
            });
    });

    QUnit.asyncTest('search', function(assert) {
        var $container = $('#qunit-fixture');
        var config = {
            classUri : 'http://www.tao.lu/Ontologies/TAOItem.rdf#Item',
            classes : classesData,
            format : 'list'
        };

        QUnit.expect(6);

        resourceSelectorFactory($container, config)
            .on('update.foo', function(){
                var $search = $('.search input', this.getElement());

                this.off('update.foo');

                assert.equal($search.length, 1, 'The search field exists');

                this.on('query', function(params){
                    var search = JSON.parse(params.search);
                    assert.equal(search[labelUri], 'foo', 'The pattern is contains now the search value');
                    QUnit.start();
                });
                $search.val('foo').trigger('keyup');
            })
            .on('query.bar', function(params){
                var search;

                assert.equal(typeof params.search, 'string', 'The search parameter is an JSON encoded string ');
                search = JSON.parse(params.search);

                assert.equal(typeof search, 'object', 'The search is an object');
                assert.equal(typeof search[labelUri], 'string', 'The search contains a label');
                assert.equal(search[labelUri], '', 'The pattern is empty');

                this.update(listData, params);
                this.off('query.bar');
            });
    });

    QUnit.asyncTest('search query', function(assert) {
        var $container = $('#qunit-fixture');
        var config = {
            classUri : 'http://www.tao.lu/Ontologies/TAOItem.rdf#Item',
            classes : classesData,
            format : 'list'
        };

        QUnit.expect(9);

        resourceSelectorFactory($container, config)
            .on('render', function(){
                var searchQuery = this.getSearchQuery();

                assert.equal(typeof searchQuery, 'object', 'The search is an object');
                assert.equal(typeof searchQuery[labelUri], 'string', 'The search the label by default');
                assert.equal(searchQuery[labelUri], '', 'The label is empty');

                this.setSearchQuery('plop');
                searchQuery = this.getSearchQuery();

                assert.equal(typeof searchQuery, 'object', 'The search is an object');
                assert.equal(typeof searchQuery[labelUri], 'string', 'The search the label by default');
                assert.equal(searchQuery[labelUri], 'plop', 'The label contains the correct search pattern');

                this.setSearchQuery({
                    'http://foo#bar' : 'noz'
                });
                searchQuery = this.getSearchQuery();

                assert.equal(typeof searchQuery, 'object', 'The search is still an object');
                assert.equal(typeof searchQuery[labelUri], 'undefined', 'No label anymore');
                assert.equal(searchQuery['http://foo#bar'], 'noz', 'The search contains the correct filters');

                QUnit.start();
            });
    });

    QUnit.asyncTest('class change', function(assert) {
        var $container = $('#qunit-fixture');
        var config = {
            classUri : 'http://www.tao.lu/Ontologies/TAOItem.rdf#Item',
            classes : classesData,
            format : 'list'
        };

        QUnit.expect(5);

        resourceSelectorFactory($container, config)
            .on('update.foo', function(){
                var $classOptions = $('.class-selector .options', this.getElement());
                var $subClass = $('[data-uri="http://bertao/tao.rdf#i1491898694361191"]', $classOptions);

                this.off('update.foo');

                assert.equal($classOptions.length, 1, 'The class selector options exist');
                assert.equal($subClass.length, 1, 'The sub class options exists in the selector');

                assert.equal(this.classUri, 'http://www.tao.lu/Ontologies/TAOItem.rdf#Item', 'The selected class matches the root class');

                this.on('query', function(params){
                    assert.equal(this.classUri, 'http://bertao/tao.rdf#i1491898694361191', 'The selected class matches the sub class');
                    assert.equal(this.classUri, params.classUri, 'The parameter class matches the sub class');
                    QUnit.start();
                });

                $subClass.click();
            })
            .on('query.bar', function(params){
                this.update(listData, params);
                this.off('query.bar');
            });
    });


    QUnit.module('Visual');

    QUnit.asyncTest('playground', function(assert) {
        var container = document.getElementById('visual');
        var config = {
            classUri : 'http://www.tao.lu/Ontologies/TAOItem.rdf#Item',
            classes : classesData
        };

        resourceSelectorFactory(container, config)
            .on('render', function(){
                assert.ok(true);
                QUnit.start();
            })
            .on('query', function(params){
                if(params.format === 'tree'){
                    if(config.classUri === params.classUri){
                        this.update(treeRootData, params);
                    } else {
                        this.update(treeNodeData, params);
                    }
                }
                if(params.format === 'list'){
                    this.update(listData, params);
                }
            });
    });
});
