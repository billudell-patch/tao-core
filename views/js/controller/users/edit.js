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

define([
    'jquery',
    'lodash',
    'i18n',
    'module',
    'util/url',
    'core/dataProvider/request',
    'ui/feedback',
    'ui/generis/form/form'
], function(
    $,
    _,
    __,
    module,
    url,
    request,
    feedback,
    generisFormFactory
) {
    'use strict';

    /**
     * The user add controller
     * @exports controller/users/add
     */
    return {
        start: function() {
            var route = url.route('edit', 'RestUser', 'tao');
            var classUri = 'http://www.tao.lu/Ontologies/generis.rdf#User';
            var uri = module.config().uri;

            request(route, {
                classUri: classUri,
                uri: uri
            }, 'get')
            .then(function (data) {
                generisFormFactory(
                    data,
                    { title: __('Edit a user') }
                )
                .render($('.form-container'))
                .on('submit', function (formData) {
                    var self = this;

                    formData
                    .push({ name: 'uri', value: uri })
                    .push({ name: 'classUri', value: classUri });

                    this.toggleLoading();

                    request(route, formData, 'put')
                    .then(function () {
                        setTimeout(function () {
                            self.clearWidgets();
                            self.toggleLoading();
                        }, 1000);

                        feedback().success(__('User saved'));
                    })
                    .catch(function (err) {
                        self.toggleLoading();

                        _.each(err.response.data, function (message, widgetUri) {
                            var widget = self.getWidget(widgetUri);

                            widget.addErrors(message);
                        });

                        feedback().error(err);
                    });
                });
            });
        }
    };
});
