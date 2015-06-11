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
 * Copyright (c) 2015 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 *
 */
namespace oat\tao\model;

use oat\oatbox\AbstractRegistry;
use common_ext_ExtensionsManager;
use Jig\Utils\StringUtils;


class ThemeRegistry extends AbstractRegistry
{
    /**
     *
     * @see \oat\oatbox\AbstractRegistry::getExtension()
     */
    protected function getExtension()
{
    return common_ext_ExtensionsManager::singleton()->getExtensionById('tao');
}

    /**
     *
     * @see \oat\oatbox\AbstractRegistry::getConfigId()
     */
    protected function getConfigId()
    {
        return 'themes';
    }

    /**
     *
     * @author Lionel Lecaque, lionel@taotesting.com
     * @param string $target
     * @param string $themeId
     * @throws \common_Exception
     */
    public function setDefaultTheme($target, $themeId)
    {
        if(!$this->isRegistered($target)){
            throw new \common_Exception('Target '.$target.' does not exist');
        } else {
            $array = $this->get($target);
            $found = false;
            foreach ($array['available'] as $theme) {
                if ($theme['id'] == $themeId) {
                    $found = true;
                }
            }
            if (!$found) {
                throw new \common_Exception('Theme '.$themeId.' not found for target '.$target);
            }
            $array['default'] = $themeId;
            $this->set($target, $array);
        }
    }
    
    /**
     * Adds a new target to the System
     * 
     * @param string $targetId
     * @param string $baseCssPath
     */
    public function createTarget($targetId, $baseCssPath)
    {
        if ($this->isRegistered($targetId)) {
            throw new \common_Exception('Target '.$targetId.' already exists');
        }
        $array = array(
            'base'  => $baseCssPath,
            'available' => array()
        );
        $this->set($targetId, $array);
    }
    

    /**
     *
     * @author Lionel Lecaque, lionel@taotesting.com
     * @param string $id
     * @param string $name
     * @param string $path
     * @param array $targets
     */
    public function registerTheme($id, $name, $path, $targets = array() )
    {
        if (preg_match('/^[a-zA-Z0-9]*$/', $id) === 0) {
            throw new \common_Exception('Invalid id "'.$id.'"');
        }
        foreach ($targets as $target) {
            if(!$this->isRegistered($target)){
                throw new \common_Exception('Target '.$target.' does not exist');
            } else {
                $array = $this->get($target);
                foreach ($array['available'] as $theme) {
                    if ($theme['id'] == $id) {
                        throw new \common_Exception('Theme '.$id.' already exists for target '.$target);
                    }
                }
                $array['available'][] = array(
                    'id' => $id,
                    'path' => $path,
                    'name' => $name,
                );
            }
            $this->set($target, $array);
        }
    }

    /**
     *
     * @author Lionel Lecaque, lionel@taotesting.com
     */
    public function getAvailableThemes()
    {
        return json_encode($this->getMap(),JSON_PRETTY_PRINT);
    }
}