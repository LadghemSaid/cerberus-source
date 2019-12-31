/* Cerberus Copyright (C) 2013 - 2017 cerberustesting
 DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.

 This file is part of Cerberus.

 Cerberus is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Cerberus is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Cerberus.  If not, see <http://www.gnu.org/licenses/>.*/
package org.cerberus.crud.factory.impl;

import javax.annotation.Nullable;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.cerberus.crud.entity.DashboardEntry;
import org.cerberus.crud.factory.IFactoryDashboardEntry;
import org.springframework.stereotype.Service;

/**
 *
 * @author utilisateur
 */
@Service
public class FactoryDashboardEntry implements IFactoryDashboardEntry {

    private static final Logger LOG = LogManager.getLogger(FactoryDashboardEntry.class);

    @Override
    public DashboardEntry create(@Nullable Integer idGroup, String codeIndicator, String paramFirst, String paramSecond, String associateElement) {
        DashboardEntry dashboardEntry = new DashboardEntry();
        if (idGroup != null) {
            dashboardEntry.setIdGroup(idGroup);
        }
        dashboardEntry.setCodeIndicator(codeIndicator);
        dashboardEntry.setParam1Val(paramFirst);
        dashboardEntry.setParam2Val(paramSecond);
        dashboardEntry.setAssociateElement(associateElement);
        return dashboardEntry;
    }
}
