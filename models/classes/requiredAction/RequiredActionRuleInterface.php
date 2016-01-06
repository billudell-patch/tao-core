<?php
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
 * Copyright (c) 2015 (original work) Open Assessment Technologies SA;
 *
 *
 */

namespace oat\tao\model\requiredAction;

/**
 * Interface RequiredActionRuleInterface
 *
 * RequiredActionRuleInterface rule which checks whether an action must be executed
 *
 * @package oat\tao\model\requiredAction
 * @author Aleh Hutnilau <hutnikau@1pt.com>
 */
interface RequiredActionRuleInterface
{
    /**
     * Check the rule.
     * @return boolean
     */
    function check();

    /**
     * Mark rule as completed
     * @return mixed
     */
    function completed();

    /**
     * Set required action instance
     * @param \oat\tao\model\requiredAction\RequiredActionInterface $requiredAction
     * @return mixed
     */
    function setRequiredAction(RequiredActionInterface $requiredAction);
}