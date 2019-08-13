/**
 * Cerberus Copyright (C) 2013 - 2017 cerberustesting
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This file is part of Cerberus.
 *
 * Cerberus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cerberus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Cerberus.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.cerberus.service.robotproviders;

import java.util.List;
import org.json.JSONObject;

/**
 *
 * @author vertigo17
 */
public interface IBrowserstackService {

    /**
     *
     * @param sessionId BrowserStack session id.
     * @param status TestCase Execution control status.
     * @param reason Detailed reason.
     * @param user BrowserStack user
     * @param pass BrowserStack password
     */
    public void setSessionStatus(String system, String sessionId, String status, String reason, String user, String pass);

    /**
     *
     * @param tag Tag value.
     */
    public String getBrowserStackBuildHash(String system, String tag, String user, String pass);

    /**
     *
     * @param sessionId
     * @param user
     * @param pass
     * @return
     */
    public List<String> getSeleniumLogs(String sessionId, String user, String pass);

    /**
     *
     * @param sessionId
     * @param user
     * @param pass
     * @return
     */
    public JSONObject getHarLogs(String sessionId, String user, String pass);

}
