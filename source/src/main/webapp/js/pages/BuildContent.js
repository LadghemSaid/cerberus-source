/*
 * Cerberus  Copyright (C) 2013  vertigo17
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

$.when($.getScript("js/pages/global/global.js")).then(function () {
    $(document).ready(function () {
        initPage();
    });
});

function initPage() {
    displayPageLabel();

    var urlBuild = GetURLParameter('build'); // Feed Build combo with Build list.
    var urlRevision = GetURLParameter('revision'); // Feed Revision combo with Revision list.
    var urlApplication = GetURLParameter('application');

    // Filter combo
    appendBuildList('#selectBuild', "1", urlBuild, "Y", "Y");
    appendBuildList('#selectRevision', "2", urlRevision, "Y", "Y");

    // Combo in install instruction Modal
    appendBuildList('#selectBuildFrom', "1", urlBuild, "N", "N");
    appendBuildList('#selectRevisionFrom', "2", urlRevision, "N", "N");
    appendBuildList('#selectBuildTo', "1", urlBuild, "N", "N");
    appendBuildList('#selectRevisionTo', "2", urlRevision, "N", "N");

    // Add and edit Modal combo
    appendBuildList('#addBuild', "1", urlBuild, "N", "Y");
    appendBuildList('#addRevision', "2", urlRevision, "N", "Y");
    appendBuildList('#editBuild', "1", urlBuild, "N", "Y");
    appendBuildList('#editRevision', "2", urlRevision, "N", "Y");

    // Mass Action Modal combo
    appendBuildList('#massBuild', "1", null, "N", "Y");
    appendBuildList('#massRevision', "2", null, "N", "Y");

    // Feed Application combo with Application list.
    var select = $('#selectApplication');
    select.append($('<option></option>').text("-- ALL --").val("ALL"));
    displayApplicationList("application", getUser().defaultSystem, urlApplication);

    displayProjectList("project");
    displayUserList("releaseowner");

    var table = loadBCTable(urlBuild, urlRevision, urlApplication);
    table.fnSort([12, 'desc']);

    // handle the click for specific action buttons
    $("#addBrpButton").click(addEntryModalSaveHandler);
    $("#editBrpButton").click(editEntryModalSaveHandler);
    $("#massActionBrpButton").click(massActionModalSaveHandler);

    //clear the modals fields when closed
    $('#addBrpModal').on('hidden.bs.modal', addEntryModalCloseHandler);
    $('#editBrpModal').on('hidden.bs.modal', editEntryModalCloseHandler);
    $('#massActionBrpModal').on('hidden.bs.modal', massActionModalCloseHandler);

    $('#listInstallInstructions').on('hidden.bs.modal', listInstallInstructionsModalCloseHandler);
}

function displayPageLabel() {
    var doc = new Doc();

    displayHeaderLabel(doc);
    $("#pageTitle").html(doc.getDocLabel("page_buildcontent", "title"));
    $("#title").html(doc.getDocOnline("page_buildcontent", "title"));
    $("[name='createBrpField']").html(doc.getDocLabel("page_buildcontent", "button_create"));
    $("[name='confirmationField']").html(doc.getDocLabel("page_buildcontent", "button_delete"));
    $("[name='editBrpField']").html(doc.getDocLabel("page_buildcontent", "button_edit"));
    $("[name='buttonAdd']").html(doc.getDocLabel("page_global", "buttonAdd"));
    $("[name='buttonClose']").html(doc.getDocLabel("page_global", "buttonClose"));
    $("[name='buttonConfirm']").html(doc.getDocLabel("page_global", "buttonConfirm"));
    $("[name='buttonDismiss']").html(doc.getDocLabel("page_global", "buttonDismiss"));
    $("[name='filtersField']").html(doc.getDocOnline("page_buildcontent", "filters"));
    $("[name='shortcutsField']").html(doc.getDocOnline("page_buildcontent", "standardfilters"));
    $("[name='listField']").html(doc.getDocOnline("page_buildcontent", "list"));
    $("[name='btnLoad']").html(doc.getDocLabel("page_global", "buttonLoad"));
    $("[name='btnLoadPending']").html(doc.getDocLabel("page_buildcontent", "buttonLoadPending"));
    $("[name='btnLoadLatest']").html(doc.getDocLabel("page_buildcontent", "buttonLoadLatest"));
    $("[name='btnLoadAll']").html(doc.getDocLabel("page_buildcontent", "buttonLoadAll"));

    $("[name='idField']").html(doc.getDocOnline("buildrevisionparameters", "id"));
    $("[name='buildField']").html(doc.getDocOnline("buildrevisionparameters", "Build"));
    $("[name='revisionField']").html(doc.getDocOnline("buildrevisionparameters", "Revision"));
    $("[name='datecreField']").html(doc.getDocOnline("buildrevisionparameters", "datecre"));
    $("[name='applicationField']").html(doc.getDocOnline("buildrevisionparameters", "application"));
    $("[name='releaseField']").html(doc.getDocOnline("buildrevisionparameters", "Release"));
    $("[name='ownerField']").html(doc.getDocOnline("buildrevisionparameters", "ReleaseOwner"));
    $("[name='projectField']").html(doc.getDocOnline("buildrevisionparameters", "project"));
    $("[name='ticketIdFixedField']").html(doc.getDocOnline("buildrevisionparameters", "TicketIDFixed"));
    $("[name='bugIdFixedField']").html(doc.getDocOnline("buildrevisionparameters", "BugIDFixed"));
    $("[name='linkField']").html(doc.getDocOnline("buildrevisionparameters", "Link"));
    $("[name='subjectField']").html(doc.getDocOnline("buildrevisionparameters", "subject"));
    $("[name='jenkinsBuildIdField']").html(doc.getDocOnline("buildrevisionparameters", "jenkinsBuildId"));
    $("[name='mavenGroupIdField']").html(doc.getDocOnline("buildrevisionparameters", "mavenGroupId"));
    $("[name='mavenArtifactIdField']").html(doc.getDocOnline("buildrevisionparameters", "mavenArtifactId"));
    $("[name='mavenVersionField']").html(doc.getDocOnline("buildrevisionparameters", "mavenVersion"));
    displayFooter(doc);
}

function loadBCTable(selectBuild, selectRevision, selectApplication) {

    if (isEmpty(selectBuild)) {
        selectBuild = $("#selectBuild").val();
    }
    if (isEmpty(selectRevision)) {
        selectRevision = $("#selectRevision").val();
    }
    if (isEmpty(selectApplication)) {
        selectApplication = $("#selectApplication").val();
    }

    // We add the Browser history.
    var CallParam = '?';
    if (!isEmptyorALL(selectBuild))
        CallParam += 'build=' + encodeURIComponent(selectBuild);
    if (!isEmptyorALL(selectRevision))
        CallParam += '&revision=' + encodeURIComponent(selectRevision)
    if (!isEmptyorALL(selectApplication))
        CallParam += '&application=' + encodeURIComponent(selectApplication);
    InsertURLInHistory('BuildContent.jsp' + CallParam);

    //clear the old report content before reloading it
    $("#buildContentList").empty();
    $("#buildContentList").html('<table id="buildrevisionparametersTable" class="table table-hover display" name="buildrevisionparametersTable">\n\
                                            </table><div class="marginBottom20"></div>');

    //configure and create the dataTable
    var contentUrl = "ReadBuildRevisionParameters?system=" + getUser().defaultSystem;
    if (selectRevision !== 'ALL') {
        contentUrl += "&revision=" + selectRevision;
    }
    if (selectBuild !== 'ALL') {
        contentUrl += "&build=" + selectBuild;
    }
    if (selectApplication !== 'ALL') {
        contentUrl += "&application=" + selectApplication;
    }

    var configurations = new TableConfigurationsServerSide("buildrevisionparametersTable", contentUrl, "contentTable", aoColumnsFunc("buildrevisionparametersTable"));

    var table = createDataTableWithPermissions(configurations, renderOptionsForBrp);

    // handle the click for specific action on the list.
    $("#selectAll").click(selectAll);

    return table;
}

function renderOptionsForBrp(data) {
    var doc = new Doc();
    //check if user has permissions to perform the add and import operations
    if (data["hasPermissions"]) {

        if ($("#createBrpButton").length === 0) {
            var contentToAdd = "<div class='marginBottom10'>";
            contentToAdd += "<button id='createBrpMassButton' type='button' class='btn btn-default'>" + doc.getDocLabel("page_global", "button_massAction") + "</button>";
            contentToAdd += "<button id='createBrpButton' type='button' class='btn btn-default'>" + doc.getDocLabel("page_buildcontent", "button_create") + "</button>";
            contentToAdd += "</div>";

            $("#buildrevisionparametersTable_wrapper div.ColVis").before(contentToAdd);
            $('#buildContentList #createBrpButton').click(addEntryClick);
            $('#buildContentList #createBrpMassButton').click(massActionClick);
        }
    }
}

function setPending() {
    var myBuild = "NONE";
    var myRevision = "NONE";
    var myAplication = "ALL";

    $('#selectBuild').val(myBuild);
    $('#selectRevision').val(myRevision);
    $('#selectApplication').val(myAplication);
    // We refresh the list.
    loadBCTable();
}

function setAll() {
    var myBuild = "ALL";
    var myRevision = "ALL";
    var myAplication = "ALL";

    $('#selectBuild').val(myBuild);
    $('#selectRevision').val(myRevision);
    $('#selectApplication').val(myAplication);
    // We refresh the list.
    loadBCTable();
}

function setLatest() {
    var myBuild = "";
    var myRevision = "";

    // We get the last build revision from ReadBuildRevisionParameters servlet with getlast parameter.
    var param = "getlast=&system=" + getUser().defaultSystem;
    var jqxhr = $.get("ReadBuildRevisionParameters", param, "json");

    $.when(jqxhr).then(function (data) {
        var messageType = getAlertType(data.messageType);
        if (messageType === "success") {
            myBuild = data.contentTable.build;
            myRevision = data.contentTable.revision;
            $('#selectBuild').val(myBuild);
            $('#selectRevision').val(myRevision);
            // We refresh the list.
            loadBCTable();
        } else {
            showMessageMainPage(messageType, data.message);
        }
    }).fail(handleErrorAjaxAfterTimeout);

}

function appendBuildList(selectName, level, defaultValue, withAll, withNone) {
    var select = $(selectName);

    $.ajax({
        type: "GET",
        url: "ReadBuildRevisionInvariant",
        data: {iSortCol_0: "2", system: getUser().defaultSystem, level: level},
        async: false,
        dataType: 'json',
        success: function (data) {
            if (withAll === "Y") {
                select.append($('<option></option>').text("-- ALL --").val("ALL"));
            }
            if (withNone === "Y") {
                select.append($('<option></option>').text("NONE").val("NONE"));
            }

            for (var option in data.contentTable) {
                select.append($('<option></option>').text(data.contentTable[option].versionName).val(data.contentTable[option].versionName));
            }

            if (defaultValue !== undefined) {
                select.val(defaultValue);
            }

        },
        error: showUnexpectedError
    });
}

function deleteEntryHandlerClick() {
    var id = $('#confirmationModal').find('#hiddenField1').prop("value");
    var jqxhr = $.post("DeleteBuildRevisionParameters", {id: id}, "json");
    $.when(jqxhr).then(function (data) {
        var messageType = getAlertType(data.messageType);
        if (messageType === "success") {
            //redraw the datatable
            var oTable = $("#buildrevisionparametersTable").dataTable();
            oTable.fnDraw(true);
            var info = oTable.fnGetData().length;

            if (info === 1) {//page has only one row, then returns to the previous page
                oTable.fnPageChange('previous');
            }

        }
        //show message in the main page
        showMessageMainPage(messageType, data.message);
        //close confirmation window
        $('#confirmationModal').modal('hide');
    }).fail(handleErrorAjaxAfterTimeout);
}

function deleteEntryClick(id, build, revision, release, application) {
    clearResponseMessageMainPage();
    var doc = new Doc();
    var messageComplete = doc.getDocLabel("page_buildcontent", "message_delete");
    messageComplete = messageComplete.replace("%ENTRY%", id);
    messageComplete = messageComplete.replace("%BUILD%", build);
    messageComplete = messageComplete.replace("%REVISION%", revision);
    messageComplete = messageComplete.replace("%RELEASE%", release);
    messageComplete = messageComplete.replace("%APPLI%", application);
    showModalConfirmation(deleteEntryHandlerClick, doc.getDocLabel("page_buildcontent", "button_delete"), messageComplete, id, "", "", "");
}

function addEntryModalSaveHandler() {
    var doc = new Doc();
    clearResponseMessage($('#addBrpModal'));
    var formAdd = $("#addBrpModal #addBrpModalForm");

    var nameElement = formAdd.find("#build");
    var nameElementEmpty = nameElement.prop("value") === '';
    if (nameElementEmpty) {
        var localMessage = new Message("danger", doc.getDocLabel("page_buildcontent", "message_ErrorBuild"));
        nameElement.parents("div.form-group").addClass("has-error");
        showMessage(localMessage, $('#addBrpModal'));
    } else {
        nameElement.parents("div.form-group").removeClass("has-error");
    }

    // verif if all mendatory fields are not empty
    if (nameElementEmpty)
        return;

    showLoaderInModal('#addBrpModal');
    var jqxhr = $.post("CreateBuildRevisionParameters", formAdd.serialize());
    $.when(jqxhr).then(function (data) {
        hideLoaderInModal('#addBrpModal');
        console.log(data.messageType);
        if (getAlertType(data.messageType) === 'success') {
            var oTable = $("#buildrevisionparametersTable").dataTable();
            oTable.fnDraw(true);
            showMessage(data);
            $('#addBrpModal').modal('hide');
        } else {
            showMessage(data, $('#addBrpModal'));
        }
    }).fail(handleErrorAjaxAfterTimeout);
}

function addEntryModalCloseHandler() {
    // reset form values
    $('#addBrpModal #addBrpModalForm')[0].reset();
    // remove all errors on the form fields
    $(this).find('div.has-error').removeClass("has-error");
    // clear the response messages of the modal
    clearResponseMessage($('#addBrpModal'));
}

function addEntryClick() {
    clearResponseMessageMainPage();
    // When creating a new item, Define here the default value.
    var formAdd = $('#addBrpModal');

    // User that makes the creation is becoming the owner or the release.
    formAdd.find("#owner").prop("value", getUser().login);
    // New release goes by default to the build/revision selected in filter combos. (except when ALL)
    var myBuild = $("#selectBuild option:selected").val();
    var myRevision = $("#selectRevision option:selected").val();
    if (myBuild === 'ALL') {
        myBuild = 'NONE';
    }
    if (myRevision === 'ALL') {
        myRevision = 'NONE';
    }
    formAdd.find("#addBuild").val(myBuild);
    formAdd.find("#addRevision").val(myRevision);
    // New release goes by default to the application selected in filter combos. (except when ALL)
    var myAppli = $("#selectApplication option:selected").val();
    if (myAppli !== 'ALL') {
        formAdd.find("#application").val(myAppli);
    }

    $('#addBrpModal').modal('show');
}

function editEntryModalSaveHandler() {
    clearResponseMessage($('#editBrpModal'));
    var formEdit = $('#editBrpModal #editBrpModalForm');
    showLoaderInModal('#editBrpModal');

    var jqxhr = $.post("UpdateBuildRevisionParameters", formEdit.serialize(), "json");
    $.when(jqxhr).then(function (data) {
        // unblock when remote call returns 
        hideLoaderInModal('#editBrpModal');
        if (getAlertType(data.messageType) === "success") {
            var oTable = $("#buildrevisionparametersTable").dataTable();
            oTable.fnDraw(true);
            $('#editBrpModal').modal('hide');
            showMessage(data);

        } else {
            showMessage(data, $('#editBrpModal'));
        }
    }).fail(handleErrorAjaxAfterTimeout);
}

function editEntryModalCloseHandler() {
    // reset form values
    $('#editBrpModal #editBrpModalForm')[0].reset();
    // remove all errors on the form fields
    $(this).find('div.has-error').removeClass("has-error");
    // clear the response messages of the modal
    clearResponseMessage($('#editBrpModal'));
}

function editEntryClick(id) {
    clearResponseMessageMainPage();
    var jqxhr = $.getJSON("ReadBuildRevisionParameters", "id=" + id);
    $.when(jqxhr).then(function (data) {
        var obj = data["contentTable"];

        var formEdit = $('#editBrpModal');

        formEdit.find("#id").prop("value", id);
        formEdit.find("#editBuild").prop("value", obj["build"]);
        formEdit.find("#editRevision").prop("value", obj["revision"]);
        formEdit.find("#datecre").prop("value", obj["datecre"]);
        formEdit.find("#application").prop("value", obj["application"]);
        formEdit.find("#release").prop("value", obj["release"]);
        formEdit.find("#owner").prop("value", obj["releaseOwner"]);
        formEdit.find("#project").prop("value", obj["project"]);
        formEdit.find("#ticketIdFixed").prop("value", obj["ticketIdFixed"]);
        formEdit.find("#bugIdFixed").prop("value", obj["bugIdFixed"]);
        formEdit.find("#link").prop("value", obj["link"]);
        formEdit.find("#subject").prop("value", obj["subject"]);
        formEdit.find("#jenkinsBuildId").prop("value", obj["jenkinsBuildId"]);
        formEdit.find("#mavenGroupId").prop("value", obj["mavenGroupId"]);
        formEdit.find("#mavenArtifactId").prop("value", obj["mavenArtifactId"]);
        formEdit.find("#mavenVersion").prop("value", obj["mavenVersion"]);

        if (!(data["hasPermissions"])) { // If readonly, we only readonly all fields
            formEdit.find("#link").prop("readonly", "readonly");
            formEdit.find("#editBuild").prop("disabled", "disabled");
            formEdit.find("#editRevision").prop("disabled", "disabled");
            formEdit.find("#datecre").prop("readonly", "readonly");
            formEdit.find("#application").prop("disabled", "disabled");
            formEdit.find("#release").prop("readonly", "readonly");
            formEdit.find("#owner").prop("disabled", "disabled");
            formEdit.find("#project").prop("disabled", "disabled");
            formEdit.find("#ticketIdFixed").prop("readonly", "readonly");
            formEdit.find("#bugIdFixed").prop("readonly", "readonly");
            formEdit.find("#link").prop("readonly", "readonly");
            formEdit.find("#subject").prop("readonly", "readonly");
            formEdit.find("#jenkinsBuildId").prop("readonly", "readonly");
            formEdit.find("#mavenGroupId").prop("readonly", "readonly");
            formEdit.find("#mavenArtifactId").prop("readonly", "readonly");
            formEdit.find("#mavenVersion").prop("readonly", "readonly");
            $('#editBrpButton').attr('class', '');
            $('#editBrpButton').attr('hidden', 'hidden');
            console.debug("readonly");
        }

        formEdit.modal('show');
    });
}

/**
 * Handler that cleans the modal for editing subdata when it is closed.
 */
function listInstallInstructionsModalCloseHandler() {
    $('#installInstructionsTableBody tr').remove();
}

/**
 * Handler that cleans the modal for editing subdata when it is closed.
 */
function refreshlistInstallInstructions() {
    $('#installInstructionsTableBody tr').remove();


    var formEdit = $('#listInstallInstructions');

    var selectBuildFrom = $("#selectBuildFrom").val();
    var selectRevisionFrom = $("#selectRevisionFrom").val();
    var selectBuildTo = $("#selectBuildTo").val();
    var selectRevisionTo = $("#selectRevisionTo").val();


    var jqxhr = $.getJSON("ReadBuildRevisionParameters", "system=" + getUser().defaultSystem + "&lastbuild=" + selectBuildFrom + "&lastrevision=" + selectRevisionFrom
            + "&build=" + selectBuildTo + "&revision=" + selectRevisionTo + "&getSVNRelease");
    $.when(jqxhr).then(function (result) {
        $.each(result["contentTable"], function (idx, obj) {
            appendNewInstallRow(obj.build, obj.revision, obj.application, obj.release, "", obj.mavenVersion);
        });
    }).fail(handleErrorAjaxAfterTimeout);

    var jqxhr = $.getJSON("ReadBuildRevisionParameters", "system=" + getUser().defaultSystem + "&lastbuild=" + selectBuildFrom + "&lastrevision=" + selectRevisionFrom
            + "&build=" + selectBuildTo + "&revision=" + selectRevisionTo + "&getNonSVNRelease");
    $.when(jqxhr).then(function (result) {
        $.each(result["contentTable"], function (idx, obj) {
            appendNewInstallRow(obj.build, obj.revision, obj.application, obj.release, obj.link, "");
        });
    }).fail(handleErrorAjaxAfterTimeout);

    formEdit.modal('show');
}

/**
 * Display installation instructions modal if build and revision is defined in main screen.
 */
function displayInstallInstructions() {
    var doc = new Doc();
    clearResponseMessageMainPage();

    var selectBuild = $("#selectBuild").val();
    var selectRevision = $("#selectRevision").val();

    if ((selectBuild === 'ALL') || (selectRevision === 'ALL') || (selectBuild === 'NONE') || (selectRevision === 'NONE')) {
        var localMessage = new Message("danger", doc.getDocLabel("page_buildcontent", "message_instruction"));
        console.warn(localMessage.message);
        showMessage(localMessage, null);

    } else {

// init the select build and rev when coming from the main screen.
        $("#selectBuildFrom").prop("value", selectBuild);
        $("#selectRevisionFrom").prop("value", selectRevision);
        $("#selectBuildTo").prop("value", selectBuild);
        $("#selectRevisionTo").prop("value", selectRevision);

        var formEdit = $('#listInstallInstructions');

        var jqxhr = $.getJSON("ReadBuildRevisionParameters", "system=" + getUser().defaultSystem + "&build=" + selectBuild + "&revision=" + selectRevision + "&getSVNRelease");
        $.when(jqxhr).then(function (result) {
            $.each(result["contentTable"], function (idx, obj) {
                appendNewInstallRow(obj.build, obj.revision, obj.application, obj.release, "", obj.mavenVersion);
            });
        }).fail(handleErrorAjaxAfterTimeout);

        var jqxhr = $.getJSON("ReadBuildRevisionParameters", "system=" + getUser().defaultSystem + "&build=" + selectBuild + "&revision=" + selectRevision + "&getNonSVNRelease");
        $.when(jqxhr).then(function (result) {
            $.each(result["contentTable"], function (idx, obj) {
                appendNewInstallRow(obj.build, obj.revision, obj.application, obj.release, obj.link, "");
            });
        }).fail(handleErrorAjaxAfterTimeout);

        formEdit.modal('show');
    }
}

/**
 * Render 1 line on installation instructions modal.
 */
function appendNewInstallRow(build, revision, application, release, link, version) {
    var doc = new Doc();
    if ((version === null) || (version === "undefined") || (version === ""))
        version = "";
    var link_html = "";
    if (link === "") {
        link_html = "";
    } else {
        link_html = '<a target="_blank" href="' + link + '">link</a>';
    }
    //for each install instructions adds a new row
    $('#installInstructionsTableBody').append('<tr> \n\
        <td><div class="nomarginbottom form-group form-group-sm">\n\
            <input readonly name="build" type="text" class="releaseClass form-control input-xs" value="' + build + '"/><span></span></div></td>\n\\n\
        <td><div class="nomarginbottom form-group form-group-sm">\n\
            <input readonly name="build" type="text" class="releaseClass form-control input-xs" value="' + revision + '"/><span></span></div></td>\n\\n\
        <td><div class="nomarginbottom form-group form-group-sm">\n\
            <input readonly name="application" type="text" class="releaseClass form-control input-xs" value="' + application + '"/><span></span></div></td>\n\\n\
        <td><div class="nomarginbottom form-group form-group-sm">\n\
            <input readonly name="release" type="text" class="releaseClass form-control input-xs" value="' + release + '"/><span></span></div></td>\n\\n\
        <td style="text-align:center"><div class="nomarginbottom form-group form-group-sm">' + link_html + '</div></td>\n\\n\
        <td><div class="nomarginbottom form-group form-group-sm">\n\n\
            <input readonly name="version" type="text" class="releaseClass form-control input-xs" value="' + version + '" /></div></td>\n\
        </tr>');
}

function selectAll() {
    console.debug("toto");
    if ($(this).prop("checked"))
        $("[data-line='select']").prop("checked", true);
    else
        $("[data-line='select']").removeProp("checked");
}

function massActionModalSaveHandler() {
    clearResponseMessage($('#massActionBrpModal'));

    var formNewValues = $('#massActionBrpModal #massActionBrpModalForm');
    var formList = $('#massActionForm');
    var paramSerialized = formNewValues.serialize() + "&" + formList.serialize().replace(/=on/g, '').replace(/id-/g, 'id=');

    showLoaderInModal('#massActionBrpModal');

    var jqxhr = $.post("UpdateBuildRevisionParameters", paramSerialized, "json");
    $.when(jqxhr).then(function (data) {
        // unblock when remote call returns 
        hideLoaderInModal('#massActionBrpModal');
        if (getAlertType(data.messageType) === "success") {
            var oTable = $("#buildrevisionparametersTable").dataTable();
            oTable.fnDraw(true);
            $('#massActionBrpModal').modal('hide');
            showMessage(data);

        } else {
            showMessage(data, $('#massActionBrpModal'));
        }
    }).fail(handleErrorAjaxAfterTimeout);
}

function massActionModalCloseHandler() {
    // reset form values
    $('#massActionBrpModal #massActionBrpModalForm')[0].reset();
    // remove all errors on the form fields
    $(this).find('div.has-error').removeClass("has-error");
    // clear the response messages of the modal
    clearResponseMessage($('#massActionBrpModal'));
}

function massActionClick() {
    var doc = new Doc();
    console.debug("Mass Action");
    clearResponseMessageMainPage();
    // When creating a new item, Define here the default value.
    var formList = $('#massActionForm');
    if (formList.serialize().indexOf("id-") === -1) {
        var localMessage = new Message("danger", doc.getDocLabel("page_buildcontent", "message_massActionError1"));
        showMessage(localMessage, null);
    } else {
        $('#massActionBrpModal').modal('show');
    }
}

function aoColumnsFunc(tableId) {
    var doc = new Doc();
    var aoColumns = [
        {"data": null,
            "title": '<input id="selectAll" title="' + doc.getDocLabel("page_global", "tooltip_massAction") + '" type="checkbox"></input>',
            "bSortable": false,
            "sWidth": "30px",
            "bSearchable": false,
            "mRender": function (data, type, obj) {
                var hasPermissions = $("#" + tableId).attr("hasPermissions");

                var selectBrp = '<input id="selectLine" \n\
                                class="selectBrp margin-right5" \n\
                                name="id-' + obj["id"] + '" data-line="select" data-id="' + obj["id"] + '" title="' + doc.getDocLabel("page_global", "tooltip_massActionLine") + '" type="checkbox">\n\
                                </input>';
                if (hasPermissions === "true") { //only draws the options if the user has the correct privileges
                    return '<div class="center btn-group width50">' + selectBrp + '</div>';
                }
                return '<div class="center btn-group width50"></div>';

            }
        },
        {"data": null,
            "title": doc.getDocLabel("page_global", "columnAction"),
            "bSortable": false,
            "sWidth": "80px",
            "bSearchable": false,
            "mRender": function (data, type, obj) {
                var hasPermissions = $("#" + tableId).attr("hasPermissions");

                var editBrp = '<button id="editBrp" onclick="editEntryClick(\'' + obj["id"] + '\');"\n\
                                class="editBrp btn btn-default btn-xs margin-right5" \n\
                                name="editBrp" title="' + doc.getDocLabel("page_buildcontent", "button_edit") + '" type="button">\n\
                                <span class="glyphicon glyphicon-pencil"></span></button>';
                var viewBrp = '<button id="editBrp" onclick="editEntryClick(\'' + obj["id"] + '\');"\n\
                                class="editBrp btn btn-default btn-xs margin-right5" \n\
                                name="editBrp" title="' + doc.getDocLabel("page_buildcontent", "button_edit") + '" type="button">\n\
                                <span class="glyphicon glyphicon-eye-open"></span></button>';
                var deleteBrp = '<button id="deleteBrp" onclick="deleteEntryClick(\'' + obj["id"] + '\',\'' + obj["build"] + '\',\'' + obj["revision"] + '\',\'' + obj["release"] + '\',\'' + obj["application"] + '\');" \n\
                                class="deleteBrp btn btn-default btn-xs margin-right5" \n\
                                name="deleteBrp" title="' + doc.getDocLabel("page_buildcontent", "button_delete") + '" type="button">\n\
                                <span class="glyphicon glyphicon-trash"></span></button>';
                if (hasPermissions === "true") { //only draws the options if the user has the correct privileges
                    return '<div class="center btn-group width150">' + editBrp + deleteBrp + '</div>';
                }
                return '<div class="center btn-group width150">' + viewBrp + '</div>';

            }
        },
        {"data": "build",
            "sName": "build",
            "sWidth": "70px",
            "title": doc.getDocOnline("buildrevisionparameters", "Build")},
        {"data": "revision",
            "sName": "revision",
            "sWidth": "70px",
            "title": doc.getDocOnline("buildrevisionparameters", "Revision")},
        {"data": "release",
            "sName": "release",
            "sWidth": "100px",
            "title": doc.getDocOnline("buildrevisionparameters", "Release")},
        {"data": "application",
            "sName": "application",
            "sWidth": "130px",
            "title": doc.getDocOnline("buildrevisionparameters", "application")},
        {"data": "project",
            "sName": "project",
            "sWidth": "80px",
            "title": doc.getDocOnline("buildrevisionparameters", "project")},
        {"data": "ticketIdFixed",
            "sName": "ticketIdFixed",
            "sWidth": "80px",
            "title": doc.getDocOnline("buildrevisionparameters", "TicketIDFixed")},
        {"data": "bugIdFixed",
            "sName": "bugIdFixed",
            "sWidth": "80px",
            "title": doc.getDocOnline("buildrevisionparameters", "BugIDFixed")},
        {"data": "link",
            "sName": "link",
            "sWidth": "250px",
            "title": doc.getDocOnline("buildrevisionparameters", "Link"),
            "mRender": function (data, type, oObj) {
                return drawURL(data);
            }
        },
        {"data": "releaseOwner",
            "sName": "releaseOwner",
            "sWidth": "80px",
            "title": doc.getDocOnline("buildrevisionparameters", "ReleaseOwner")},
        {"data": "subject",
            "sName": "subject",
            "sWidth": "500px",
            "title": doc.getDocOnline("buildrevisionparameters", "subject")},
        {"data": "datecre",
            "sName": "datecre",
            "sWidth": "150px",
            "title": doc.getDocOnline("buildrevisionparameters", "datecre")},
        {"data": "jenkinsBuildId",
            "sName": "jenkinsBuildId",
            "sWidth": "80px",
            "title": doc.getDocOnline("buildrevisionparameters", "jenkinsBuildId")},
        {"data": "mavenGroupId",
            "sName": "mavenGroupId",
            "sWidth": "80px",
            "title": doc.getDocOnline("buildrevisionparameters", "mavenGroupId")},
        {"data": "mavenArtifactId",
            "sName": "mavenArtifactId",
            "sWidth": "80px",
            "title": doc.getDocOnline("buildrevisionparameters", "mavenArtifactId")},
        {"data": "mavenVersion",
            "sName": "mavenVersion",
            "sWidth": "80px",
            "title": doc.getDocOnline("buildrevisionparameters", "mavenVersion")}
    ];
    return aoColumns;
}
