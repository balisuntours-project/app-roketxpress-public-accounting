var $confirmDialog = $('#modal-confirm-action');
if (accountLinkSettingsFunc == null) {
    var accountLinkSettingsFunc = function () {
        $(document).ready(function () {
            getDataAccountLinkSource();
            getDataAccountLinkVendor();
        })
    }
}

$('#sourceTab-searchKeyword').off('keypress');
$("#sourceTab-searchKeyword").on('keypress', function (e) {
    if (e.which == 13) {
        getDataAccountLinkSource();
    }
});

$('#vendorTab-searchKeyword').off('keypress');
$("#vendorTab-searchKeyword").on('keypress', function (e) {
    if (e.which == 13) {
        getDataAccountLinkVendor();
    }
});

function getDataAccountLinkSource() {
    var $tableBodyAccount = $('#sourceTab-tableAccount > tbody'),
        columnNumber = $('#sourceTab-tableAccount > thead > tr > th').length + 2,
        searchKeyword = $('#sourceTab-searchKeyword').val(),
        dataSend = { searchKeyword: searchKeyword };
    $.ajax({
        type: 'POST',
        url: baseURL + "accountLinkSettings/getDataAccountLinkSource",
        contentType: 'application/json',
        dataType: 'json',
        cache: false,
        data: mergeDataSend(dataSend),
        xhrFields: {
            withCredentials: true
        },
        headers: {
            Authorization: 'Bearer ' + getUserToken()
        },
        beforeSend: function () {
            NProgress.set(0.4);
            $tableBodyAccount.html("<tr><td colspan='" + columnNumber + "'><center><i class='fa fa-spinner fa-pulse'></i><br/>Loading data...</center></td></tr>");
        },
        complete: function (jqXHR, textStatus) {
            var responseJSON    = jqXHR.responseJSON,
                defaultEmptyRow = "<tr><td colspan='" + columnNumber + "' align='center'><center>No data available</center></td></tr>",
                rows            = "";

            switch (jqXHR.status) {
                case 200:
                    var dataAccountSource           = responseJSON.result,
                        idAccountGeneralReceivable  = responseJSON.idAccountGeneralReceivable,
                        idAccountGeneralRevenue     = responseJSON.idAccountGeneralRevenue,
                        accountGeneralCodeReceivable= responseJSON.accountGeneralCodeReceivable,
                        accountGeneralCodeRevenue   = responseJSON.accountGeneralCodeRevenue;

                    if (dataAccountSource.length == 0) {
                        rows = defaultEmptyRow;
                    } else {
                        $.each(dataAccountSource, function (index, array) {
                            let accountReceivable   =   array.ACCOUNTCODERECEIVABLE == '' ? 'Not Set' : array.ACCOUNTCODERECEIVABLE + ' - ' + array.ACCOUNTNAMERECEIVABLE,
                                accountRevenue      =   array.ACCOUNTCODEREVENUE == '' ? 'Not Set' : array.ACCOUNTCODEREVENUE + ' - ' + array.ACCOUNTNAMEREVENUE,
                                attributeToggle     =   'data-toggle="modal" data-target="#modal-chooseAccount"',
                                attributeSource     =   'data-linktype="Source" data-idsource="' + array.IDSOURCE + '" data-sourcename="' + array.SOURCENAME + '"',
                                attributeReceivable =   'data-accounttype="Account Receivable" data-idaccountgeneral="' + idAccountGeneralReceivable + '" data-accountcodegeneral="' + accountGeneralCodeReceivable + '" data-idaccountlink="' + array.IDACCOUNTLINKRECEIVABLE + '" data-idaccount="' + array.IDACCOUNTRECEIVABLE + '" data-accountlevel="' + array.ACCOUNTLEVELRECEIVABLE + '"',
                                attributeRevenue    =   'data-accounttype="Operating Revenues" data-idaccountgeneral="' + idAccountGeneralRevenue + '" data-accountcodegeneral="' + accountGeneralCodeRevenue + '" data-idaccountlink="' + array.IDACCOUNTLINKREVENUE + '" data-idaccount="' + array.IDACCOUNTREVENUE + '" data-accountlevel="' + array.ACCOUNTLEVELREVENUE + '"';

                                rows += "<tr>" +
                                            "<td class='searchTd'>" + array.SOURCENAME + "</td>" +
                                            "<td class='tdAccountLink searchTd td-hover' "+attributeSource+" " + attributeReceivable + " " + attributeToggle + ">" + accountReceivable + "</td>" +
                                            "<td class='tdAccountLink searchTd td-hover' "+attributeSource+" " + attributeRevenue + " " + attributeToggle + ">" + accountRevenue + "</td>" +
                                        "</tr>";
                        });
                    }
                    break;
                case 404:
                default:
                    rows = defaultEmptyRow;
                    break;
            }

            $tableBodyAccount.html(rows);

            if (searchKeyword != '') {
                $(":contains(" + searchKeyword + ")").each(function () {
                    if ($(this).hasClass('searchTd')) {
                        var regex = new RegExp(searchKeyword, 'i');
                        $(this).html($(this).text().replace(regex, '<mark>$&</mark>'));
                    }
                });
            }
        }
    }).always(function (jqXHR, textStatus) {
        NProgress.done()
        setUserToken(jqXHR)
    });
}

function getDataAccountLinkVendor() {
    var $tableBodyAccount = $('#vendorTab-tableAccount > tbody'),
        columnNumber = $('#vendorTab-tableAccount > thead > tr > th').length + 2,
        searchKeyword = $('#vendorTab-searchKeyword').val(),
        dataSend = { searchKeyword: searchKeyword };
    $.ajax({
        type: 'POST',
        url: baseURL + "accountLinkSettings/getDataAccountLinkVendor",
        contentType: 'application/json',
        dataType: 'json',
        cache: false,
        data: mergeDataSend(dataSend),
        xhrFields: {
            withCredentials: true
        },
        headers: {
            Authorization: 'Bearer ' + getUserToken()
        },
        beforeSend: function () {
            NProgress.set(0.4);
            $tableBodyAccount.html("<tr><td colspan='" + columnNumber + "'><center><i class='fa fa-spinner fa-pulse'></i><br/>Loading data...</center></td></tr>");
        },
        complete: function (jqXHR, textStatus) {
            var responseJSON    = jqXHR.responseJSON,
                defaultEmptyRow = "<tr><td colspan='" + columnNumber + "' align='center'><center>No data available</center></td></tr>",
                rows            = "";

            switch (jqXHR.status) {
                case 200:
                    var dataAccountVendor           = responseJSON.result,
                        idAccountGeneralPayable     = responseJSON.idAccountGeneralPayable,
                        idAccountGeneralCost        = responseJSON.idAccountGeneralCost,
                        accountGeneralCodePayable   = responseJSON.accountGeneralCodePayable,
                        accountGeneralCodeCost      = responseJSON.accountGeneralCodeCost;

                    if (dataAccountVendor.length == 0) {
                        rows = defaultEmptyRow;
                    } else {
                        $.each(dataAccountVendor, function (index, array) {
                            let accountPayable  =   array.ACCOUNTCODEPAYABLE == '' ? 'Not Set' : array.ACCOUNTCODEPAYABLE + ' - ' + array.ACCOUNTNAMEPAYABLE,
                                accountCost     =   array.ACCOUNTCODECOST == '' ? 'Not Set' : array.ACCOUNTCODECOST + ' - ' + array.ACCOUNTNAMECOST,
                                attributeToggle =   'data-toggle="modal" data-target="#modal-chooseAccount"',
                                attributeSource =   'data-linktype="Vendor" data-idvendor="' + array.IDVENDOR + '" data-vendorname="' + array.VENDORNAME + '"',
                                attributePayable=   'data-accounttype="Account Payable" data-idaccountgeneral="' + idAccountGeneralPayable + '" data-accountcodegeneral="' + accountGeneralCodePayable + '" data-idaccountlink="' + array.IDACCOUNTLINKPAYABLE + '" data-idaccount="' + array.IDACCOUNTPAYABLE + '" data-accountlevel="' + array.ACCOUNTLEVELPAYABLE + '"',
                                attributeCost   =   'data-accounttype="Cost Vendor" data-idaccountgeneral="' + idAccountGeneralCost + '" data-accountcodegeneral="' + accountGeneralCodeCost + '" data-idaccountlink="' + array.IDACCOUNTLINKCOST + '" data-idaccount="' + array.IDACCOUNTCOST + '" data-accountlevel="' + array.ACCOUNTLEVELCOST + '"';

                                rows += "<tr>" +
                                            "<td class='searchTd'>" + array.VENDORTYPE + "</td>" +
                                            "<td class='searchTd'>" + array.VENDORNAME + "</td>" +
                                            "<td class='tdAccountLink searchTd td-hover' "+attributeSource+" " + attributePayable + " " + attributeToggle + ">" + accountPayable + "</td>" +
                                            "<td class='tdAccountLink searchTd td-hover' "+attributeSource+" " + attributeCost + " " + attributeToggle + ">" + accountCost + "</td>" +
                                        "</tr>";
                        });
                    }
                    break;
                case 404:
                default:
                    rows = defaultEmptyRow;
                    break;
            }

            $tableBodyAccount.html(rows);

            if (searchKeyword != '') {
                $(":contains(" + searchKeyword + ")").each(function () {
                    if ($(this).hasClass('searchTd')) {
                        var regex = new RegExp(searchKeyword, 'i');
                        $(this).html($(this).text().replace(regex, '<mark>$&</mark>'));
                    }
                });
            }
        }
    }).always(function (jqXHR, textStatus) {
        NProgress.done()
        setUserToken(jqXHR)
    });
}

$('#modal-chooseAccount').off('shown.bs.modal');
$('#modal-chooseAccount').on('shown.bs.modal', function (e) {
    let triggerElem         =   e.relatedTarget,
        linkType            =   triggerElem.getAttribute('data-linktype'),
        idSource            =   triggerElem.getAttribute('data-idsource'),
        idVendor            =   triggerElem.getAttribute('data-idvendor'),
        sourceName          =   triggerElem.getAttribute('data-sourcename'),
        vendorName          =   triggerElem.getAttribute('data-vendorname'),
        sourceVendorName    =   sourceName != null ? sourceName : vendorName,
        accountType         =   triggerElem.getAttribute('data-accounttype'),
        accountLevel        =   triggerElem.getAttribute('data-accountlevel'),
        accountCodeGeneral  =   triggerElem.getAttribute('data-accountcodegeneral'),
        idAccountGeneral    =   triggerElem.getAttribute('data-idaccountgeneral'),
        idAccountLink       =   triggerElem.getAttribute('data-idaccountlink'),
        idAccount           =   triggerElem.getAttribute('data-idaccount');
        
    idSource    =   idSource != null ? idSource : null;
    idVendor    =   idVendor != null ? idVendor : null;
    idAccount   =   idAccount != null ? idAccount : false;

    let idAccountMain   =   accountLevel == 3 ? getIdAccountMain(idAccount) : idAccount,
        idAccountSub    =   accountLevel == 3 ? idAccount : false;
    idAccountMain       =   idAccountMain == null || idAccountMain == 'null' || idAccountMain === '' ? false : idAccountMain;

    $('#chooseAccount-sourceVendorLabel').text(linkType);
    $('#chooseAccount-sourceVendorName').text(sourceVendorName);
    $('#chooseAccount-accountType').text(accountType);

    setOptionHelper('chooseAccount-optionAccountMain', 'dataAccountMain', idAccountMain, function (firstValueAccountMain) {
        setOptionHelper('chooseAccount-optionAccountSub', 'dataAccountSub', idAccountSub, function () {
            afterSelectAccountEvent();
        }, idAccountMain == false || idAccountMain == null ? firstValueAccountMain : idAccountMain);
    }, idAccountGeneral);

    $('#chooseAccount-optionAccountMain').off('change');
    $('#chooseAccount-optionAccountMain').on('change', function (e) {
        var selectedValueAccountMain = this.value;
        setOptionHelper('chooseAccount-optionAccountSub', 'dataAccountSub', false, function () {
            afterSelectAccountEvent();
            $("#chooseAccount-optionAccountSub").select2();
        }, selectedValueAccountMain);
    });

    $('#chooseAccount-optionAccountSub').off('change');
    $('#chooseAccount-optionAccountSub').on('change', function (e) {
        afterSelectAccountEvent();
    });
    
    filterDisableOptGroup(accountCodeGeneral);
    $('#chooseAccount-idAccountGeneral').val(idAccountGeneral);
    $('#chooseAccount-idAccountLink').val(idAccountLink);
    $('#chooseAccount-idSource').val(idSource);
    $('#chooseAccount-idVendor').val(idVendor);
    return true;
});

function afterSelectAccountEvent() {
    var accountType = 'main',
        selectedValue = '';
    if ($('#chooseAccount-optionAccountSub > option').length <= 0 && $('#chooseAccount-optionAccountSub > optgroup').length <= 0) {
        selectedValue = $("#chooseAccount-optionAccountMain").val();
        $("#chooseAccount-optionAccountSub").append($("<option></option>").val('0').html('No Sub Account')).prop('disabled', true);
    } else {
        accountType = 'sub';
        selectedValue = $("#chooseAccount-optionAccountSub").val();
        $("#chooseAccount-optionAccountSub").prop('disabled', false);
    }

    var dataOptionHelper = JSON.parse(localStorage.getItem('optionHelper')),
        dataAccount = accountType == 'main' ? dataOptionHelper.dataAccountMain : dataOptionHelper.dataAccountSub,
        accountIndex = dataAccount.findIndex(elem => elem['ID'] == selectedValue),
        defaultDRCR = dataAccount[accountIndex].DEFAULTDRCR,
        defaultPlus = defaultDRCR == 'DR' ? 'Debit' : 'Credit',
        defaultMinus = defaultDRCR == 'DR' ? 'Credit' : 'Debit';
    $("#chooseAccount-textDefaultPositionPlus").html(defaultPlus);
    $("#chooseAccount-textDefaultPositionMinus").html(defaultMinus);

    return true;
}

function getIdAccountMain(idAccount) {
    var idAccountMain   =   false,
        dataOptionHelper=   JSON.parse(localStorage.getItem('optionHelper')),
        dataAccountSub  =   dataOptionHelper.dataAccountSub,
        accountSubIndex =   dataAccountSub.findIndex(elem => elem['ID'] == idAccount);

    if (accountSubIndex != -1) {
        idAccountMain = dataAccountSub[accountSubIndex].PARENTVALUE;
    }

    return idAccountMain;
}

function filterDisableOptGroup(accountCodeGeneral) {
    const dropdown  =   $('#chooseAccount-optionAccountMain');
    dropdown.find('optgroup').prop('disabled', true);
    dropdown.find('optgroup').each(function() {
        const label = $(this).attr('label');        
        if (label.startsWith(accountCodeGeneral)) {
            $(this).prop('disabled', false);
        }
    });
}

$("#form-chooseAccount").off('submit');
$("#form-chooseAccount").on("submit", function (e) {
    e.preventDefault();
    var idAccountLink   =   $('#chooseAccount-idAccountLink').val(),
        idAccountGeneral=   $('#chooseAccount-idAccountGeneral').val(),
        idAccountMain   =   $('#chooseAccount-optionAccountMain').val(),
        idAccountSub    =   $('#chooseAccount-optionAccountSub').val(),
        idAccount       =   idAccountSub == '0' ? idAccountMain : idAccountSub,
        accountLevel    =   idAccountSub == '0' ? 2 : 3,
        textAccountMain =   $('#chooseAccount-optionAccountMain option:selected').text(),
        textAccountSub  =   $('#chooseAccount-optionAccountSub option:selected').text(),
        codeNameAccount =   idAccountSub == '0' ? textAccountMain : textAccountSub,
        linkType        =   $('#chooseAccount-sourceVendorLabel').text(),
        accountType     =   $('#chooseAccount-accountType').text(),
        idTypeStr       =   linkType == 'Source' ? 'idsource' : 'idvendor',
        idSource        =   $('#chooseAccount-idSource').val(),
        idVendor        =   $('#chooseAccount-idVendor').val(),
        idSourceVendor  =   linkType == 'Source' ? idSource : idVendor;

    var dataSend = {
        idAccountLink: idAccountLink != '' && idAccountLink != undefined && idAccountLink != null && idAccountLink != 'null' ? idAccountLink : '',
        idAccountGeneral: idAccountGeneral,
        idSource: idSource,
        idVendor: idVendor,
        idAccount: idAccount
    };

    $.ajax({
        type: 'POST',
        url: baseURL + "accountLinkSettings/saveDataAccountLink",
        contentType: 'application/json',
        dataType: 'json',
        data: mergeDataSend(dataSend),
        xhrFields: {
            withCredentials: true
        },
        headers: {
            Authorization: 'Bearer ' + getUserToken()
        },
        beforeSend: function () {
            NProgress.set(0.4);
            $("#window-loader").modal("show");
        },
        complete: function (jqXHR, textStatus) {
            switch (jqXHR.status) {
                case 200:
                    let idAccountLink   =   jqXHR.responseJSON.idAccountLink,
                        elemTdTarget    =   $('td.tdAccountLink[data-linktype="' + linkType + '"][data-accounttype="' + accountType + '"][data-' + idTypeStr + '="' + idSourceVendor + '"]');
                    elemTdTarget.html(codeNameAccount).attr('data-idaccountlink', idAccountLink).attr('data-idaccount', idAccount).attr('data-accountlevel', accountLevel);
                    $("#modal-chooseAccount").modal("hide");
                    break;
                default: break;
            }
        }
    }).always(function (jqXHR, textStatus) {
        $("#window-loader").modal("hide");
        NProgress.done();
        toastr["info"](getMessageResponse(jqXHR));
        setUserToken(jqXHR);
    });
});

accountLinkSettingsFunc();