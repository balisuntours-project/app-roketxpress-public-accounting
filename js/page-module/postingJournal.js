if (postingJournalFunc == null) {
    var postingJournalFunc = function () {
        $(document).ready(function () {
            setOptionHelper('optionCompany', 'dataCompany');
            getDataPostingJournal(1);
        });
    }
}

$('#dateJournal, #optionCompany, #optionStatus').off('change');
$('#dateJournal, #optionCompany, #optionStatus').on('change', function (e) {
    getDataPostingJournal($('a.postingJournalTab.active').data('typejournal'));
});

$('#searchKeyword').off('keypress');
$("#searchKeyword").on('keypress', function (e) {
    if (e.which == 13) {
        getDataPostingJournal($('a.postingJournalTab.active').data('typejournal'));
    }
});

$('a.postingJournalTab[data-toggle="tab"]').off('shown.bs.tab');
$('a.postingJournalTab[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var typeJournal = $(e.target).data('typejournal');
    getDataPostingJournal(typeJournal);
});

function getDataPostingJournal(typeJournal) {
    typeJournal             =   parseInt(typeJournal);
    var dateJournal         =   $('#dateJournal').val(),
        idCompany           =   $('#optionCompany').val(),
        statusPosting       =   $('#optionStatus').val(),
        searchKeyword       =   $('#searchKeyword').val(),
        dataSend            =   { dateJournal: dateJournal, idCompany: idCompany, statusPosting: statusPosting, searchKeyword: searchKeyword },
		arrElemDisabled     =	['postingJournalFilter', '.postingJournalTab'],
		elFilterPropertyData=	getElementPropertyDataInContainer(arrElemDisabled),
        functionUrl         =   'getDataPostingJournalRevenueOTA';
    
    switch (typeJournal) {
        case 1: functionUrl =   'getDataPostingJournalRevenueOTA'; break;
        case 2: functionUrl =   'getDataPostingJournalPaymentOTA'; break;
        case 3: functionUrl =   'getDataPostingJournalCostVendor'; break;
        case 4: functionUrl =   'getDataPostingJournalCostDriver'; break;
        case 5: functionUrl =   'getDataPostingJournalPaymentVendor'; break;
        case 6: functionUrl =   'getDataPostingJournalPaymentDriver'; break;
    }
    
    $.ajax({
        type: 'POST',
        url: baseURL + "postingJournal/" + functionUrl,
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
			setDisabledPropertyElement(arrElemDisabled);
            resetPostingJournalForm(typeJournal);
        },
        complete: function (jqXHR, textStatus) {
            var responseJSON= jqXHR.responseJSON;

            switch (jqXHR.status) {
                case 200:
                    setDataPostingJournal(typeJournal, responseJSON);
                    break;
                case 404:
                default:
                    setPostingJournalNotAvailable(typeJournal);
                    break;
            }

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
        NProgress.done();
        setUserToken(jqXHR);
        resetDisabledPropertyElem(elFilterPropertyData);
    });
}

function resetPostingJournalForm(typeJournal) {
    let loaderElem  =   '<center class="mt-20 mb-20"><i class="fa fa-spinner fa-pulse"></i><br/>Loading data...</center>';
    switch (typeJournal) {
        case 1:
            let $tableBody  =	$('#revenueOTATab-tableSubJournalReservation > tbody'),
		        columnNumber=	$('#revenueOTATab-tableSubJournalReservation > thead > tr > th').length;
            $('#revenueOTATab-listOTA').html('<li class="nav-item">'+loaderElem+'</li>');
            $('#revenueOTATab-postStatus').html('');
            $('#revenueOTATab-reffNumber, #revenueOTATab-totalReservation, #revenueOTATab-totalNominal, #revenueOTATab-postUser, #revenueOTATab-postDateTime').html('-');
            $('#revenueOTATab-journalDescription').val('');
            $('#revenueOTATab-debitAccountTotalNominal, #revenueOTATab-creditAccountTotalNominal').html('0');
            $('#revenueOTATab-debitAccountContainer, #revenueOTATab-creditAccountContainer').html('<div class="col-12 mb-5 pt-2">' + loaderElem + '</div>');
            $('#revenueOTATab-btnAddDebitAccount, #revenueOTATab-btnAddCreditAccount, #revenueOTATab-saveJournal').addClass('d-none').prop('disabled', true);
            $tableBody.html('<tr><td colspan="' + columnNumber + '">' + loaderElem + '</td></tr>');
            $('#revenueOTATab-totalRevenueAmount, #revenueOTATab-totalRevenueAmountIDR, #revenueOTATab-totalJournalPostAmount').html(0);
            break;
        case 2:
            break;
    }
}

function setPostingJournalNotAvailable(typeJournal) {
    switch (typeJournal) {
        case 1:
            let $tableBody  =	$('#revenueOTATab-tableSubJournalReservation > tbody'),
		        columnNumber=	$('#revenueOTATab-tableSubJournalReservation > thead > tr > th').length;
            $('#revenueOTATab-listOTA').html('<li class="nav-item">No data available</li>');
            $('#revenueOTATab-debitAccountContainer, #revenueOTATab-creditAccountContainer').html('<div class="col-12 mb-5 pt-2">No data available</div>');
            $tableBody.html('<tr><td colspan="' + columnNumber + '" align="center">No data available</td></tr>');
            break;
        case 2:
            break;
    }
}

function setDataPostingJournal(typeJournal, data) {
    switch (typeJournal) {
        case 1:
            let dataRecapPerOTA     =   data.dataRecapPerOTA,
                dataJournalDetailSub=   data.dataJournalDetailSub,
                elemListOTA         =   '';

            if (dataRecapPerOTA.length > 0) {
                $.each(dataRecapPerOTA, function(index, arrayRecapPerOTA){
                    let activeClass =   index == 0 ? 'active' : '';
                    elemListOTA     +=  '<li class="nav-item">\
                                            <span class="nav-link pt-1 pb-1 ' + activeClass + '" data-toggle="tab" data-idSource="' + arrayRecapPerOTA.IDSOURCE + '">' + arrayRecapPerOTA.SOURCENAME + '</span>\
                                        </li>';
                    if(index == 0) {
                        generateDetailPostingJournalRevenueOTA(index, dataRecapPerOTA);
                        generateJournalDetailsSubRevenueOTA(dataJournalDetailSub, arrayRecapPerOTA.DEFAULTCURRENCY, parseInt(arrayRecapPerOTA.ISJOURNALPOSTED));
                    }
                });
            } else {
                elemListOTA     =   '<li class="nav-item">No data available</li>';
                setPostingJournalNotAvailable(typeJournal);
            }
            $('#revenueOTATab-listOTA').html(elemListOTA);
            activateOnchangeTabListRevenueOTA(dataRecapPerOTA);
            break;
        case 2:
            break;
    }
}

function generateDetailPostingJournalRevenueOTA(index, dataRecapPerOTA) {
    let dataDetailJournal   =   dataRecapPerOTA[index],
        listDetailJournal   =   dataDetailJournal.LISTDETAILJOURNAL,
        badgePostStatus     =   parseInt(dataDetailJournal.ISJOURNALPOSTED) == 1 ? '<span class="badge badge-success">Posted</span>' : '<span class="badge badge-warning">Pending</span>';

    $('#revenueOTATab-postStatus').html(badgePostStatus);
    $('#revenueOTATab-reffNumber').html(dataDetailJournal.REFFNUMBER);
    $('#revenueOTATab-totalReservation').html(dataDetailJournal.TOTALRESERVATION);
    $('#revenueOTATab-totalNominal').html(dataDetailJournal.TOTALNOMINAL);
    $('#revenueOTATab-postUser').html(dataDetailJournal.POSTUSER);
    $('#revenueOTATab-postDateTime').html(dataDetailJournal.POSTDATETIME);
    $('#revenueOTATab-journalDescription').val(dataDetailJournal.DESCRIPTION);

    if(listDetailJournal.length > 0) {
        let debitAccountJournal =   '', creditAccountJournal =   '';
        $.each(listDetailJournal, function(index, detailJournal){
            let idAccount       =   detailJournal.IDACCOUNT,
                drCrTypeStr     =   detailJournal.POSITIONDRCR == 'DR' ? 'debit' : 'credit',
                nominalValue    =   detailJournal.POSITIONDRCR == 'DR' ? detailJournal.DEBIT : detailJournal.CREDIT;
                accountJournal  =   '<div class="col-12 mb-5 pt-2">\
                                        <span id="revenueOTATab-' + drCrTypeStr + 'Account">'+detailJournal.ACCOUNTNAME+'</span>\
                                        <input type="hidden" id="revenueOTATab-' + drCrTypeStr + 'AccountId" value="'+idAccount+'">\
                                    </div>\
                                    <div class="col-lg-8 col-sm-12 mb-5">\
                                        <input type="text" class="form-control form-control-sm mb-0 revenueOTATab-' + drCrTypeStr + 'AccountDescription" placeholder="Description" data-accountId="'+idAccount+'" value="'+detailJournal.DESCRIPTION+'">\
                                    </div>\
                                    <div class="col-lg-4 col-sm-12 mb-5">\
                                        <input type="text" class="form-control form-control-sm mb-0 decimalInput revenueOTATab-' + drCrTypeStr + 'AccountNominal text-right" data-accountId="'+idAccount+'" id="revenueOTATab-' + drCrTypeStr + 'AccountNominal'+idAccount+'" value="'+numberFormat(nominalValue)+'" onkeypress="maskNumberInput(0, 999999999, \'revenueOTATab-' + drCrTypeStr + 'AccountNominal'+idAccount+'\')">\
                                    </div>';
            if(detailJournal.POSITIONDRCR == 'DR') debitAccountJournal += accountJournal;
            else creditAccountJournal += accountJournal;
        });

        $('#revenueOTATab-debitAccountContainer').html(debitAccountJournal);
        $('#revenueOTATab-creditAccountContainer').html(creditAccountJournal);
        $('#revenueOTATab-btnAddDebitAccount, #revenueOTATab-btnAddCreditAccount, #revenueOTATab-saveJournal').removeClass('d-none').prop('disabled', false);
    } else {
        $('#revenueOTATab-debitAccountContainer, #revenueOTATab-creditAccountContainer').html('<div class="col-12 mb-5 pt-2">No data available</div>');
        $('#revenueOTATab-btnAddDebitAccount, #revenueOTATab-btnAddCreditAccount, #revenueOTATab-saveJournal').addClass('d-none').prop('disabled', true);
    }
}

function generateJournalDetailsSubRevenueOTA(dataJournalDetailSub, defaultCurrency = '', isJournalPosted = 0) {
    let $tableBody  =	$('#revenueOTATab-tableSubJournalReservation > tbody'),
        columnNumber=	$('#revenueOTATab-tableSubJournalReservation > thead > tr > th').length;
    if(dataJournalDetailSub.length > 0) {
        let rowTable                =   '',
            totalRevenueAmount      =   totalRevenueAmountIDR  =   totalJournalPostAmount  =   0,
            totalDifferentCurrency  =   0,
            badgeSubJournalStatus   =   '-';

        $.each(dataJournalDetailSub, function(index, journalDetailSub){
            let badgeStatusRow      =   '-',
                exchangeRate        =   journalDetailSub.CURRENCY == 'IDR' ? 1 : getExchangeRateToIDR(journalDetailSub.CURRENCY),
                reservationAmount   =   journalDetailSub.REVENUEAMOUNT ? parseFloat(journalDetailSub.REVENUEAMOUNT) : 0,
                reservationAmountIDR=   reservationAmount * exchangeRate,
                journalPostAmount   =   journalDetailSub.JOURNALPOSTAMOUNT ? parseFloat(journalDetailSub.JOURNALPOSTAMOUNT) : 0;

            if(defaultCurrency != journalDetailSub.CURRENCY) {
                badgeStatusRow =   '<span class="badge badge-danger">Different Currency</span>';
                totalDifferentCurrency++;
            } else if(reservationAmountIDR != journalPostAmount) {
                if(isJournalPosted == 1) {
                    badgeStatusRow  =   '<span class="badge badge-danger">Not Match, Posted</span>';
                } else {
                    badgeStatusRow  =   '<span class="badge badge-warning">Pending</span>';
                }
            } else if(reservationAmountIDR == journalPostAmount) {
                if(isJournalPosted == 1) {
                    badgeStatusRow  =   '<span class="badge badge-warning">Match, Posted</span>';
                } else {
                    badgeStatusRow  =   '<span class="badge badge-info">Match, Pending</span>';
                }
            }

            rowTable    +=  '<tr>\
                                <td>'+journalDetailSub.REFFNUMBER+'</td>\
                                <td>'+journalDetailSub.BOOKINGCODE+'</td>\
                                <td>'+journalDetailSub.RESERVATIONTITLE+'</td>\
                                <td>'+journalDetailSub.CUSTOMERNAME+'</td>\
                                <td>'+journalDetailSub.CURRENCY+'</td>\
                                <td class="text-right">'+numberFormat(exchangeRate)+'</td>\
                                <td class="text-right">'+numberFormat(reservationAmount, 2)+'</td>\
                                <td class="text-right">'+numberFormat(reservationAmountIDR)+'</td>\
                                <td class="text-right">'+numberFormat(journalPostAmount)+'</td>\
                                <td>'+badgeStatusRow+'</td>\
                            </tr>';
            totalRevenueAmount      += reservationAmountIDR;
            totalRevenueAmountIDR   += reservationAmountIDR;
            totalJournalPostAmount  += journalPostAmount;
        });

        if(totalDifferentCurrency > 0) {
            badgeSubJournalStatus  =   '<span class="badge badge-danger">Different Currency</span>';
        } else if(isJournalPosted == 1) {
            badgeSubJournalStatus  =   totalRevenueAmountIDR != totalJournalPostAmount ? '<span class="badge badge-danger">Not Match, Posted</span>' : '<span class="badge badge-success">Match, Posted</span>';
        } else if(isJournalPosted == 0) {
            badgeSubJournalStatus  =   totalRevenueAmountIDR != totalJournalPostAmount ? '<span class="badge badge-warning">Pending</span>' : '<span class="badge badge-success">Match, Pending</span>';
        }

        $tableBody.html(rowTable);
        $('#revenueOTATab-totalRevenueAmount').html(numberFormat(totalRevenueAmount, 2));
        $('#revenueOTATab-totalRevenueAmountIDR').html(numberFormat(totalRevenueAmountIDR));
        $('#revenueOTATab-totalJournalPostAmount').html(numberFormat(totalJournalPostAmount));
        $('#revenueOTATab-subJournalStatus').html(badgeSubJournalStatus);
    } else {
        $tableBody.html('<tr><td colspan="' + columnNumber + '" align="center">No data available</td></tr>');
    }
}

function activateOnchangeTabListRevenueOTA(dataRecapPerOTA) {
    $('#revenueOTATab-listOTA .nav-link').off('click');
    $('#revenueOTATab-listOTA .nav-link').on('click', function (e) {
        let dateJournal         =   $('#dateJournal').val(),
            idCompany           =   $('#optionCompany').val(),
            index               =   $(this).parent().index(),
            idSource            =   $(this).data('idsource'),
            dataDetailJournal   =   dataRecapPerOTA[index],
            defaultCurrency     =   dataDetailJournal.DEFAULTCURRENCY,
            isJournalPosted     =   parseInt(dataDetailJournal.ISJOURNALPOSTED),
            $tableBody          =	$('#revenueOTATab-tableSubJournalReservation > tbody'),
            columnNumber        =	$('#revenueOTATab-tableSubJournalReservation > thead > tr > th').length,
            dataSend            =   { dateJournal: dateJournal, idCompany: idCompany, idSource: idSource };
        generateDetailPostingJournalRevenueOTA(index, dataRecapPerOTA);

        $.ajax({
            type: 'POST',
            url: baseURL + "postingJournal/getDataPostingJournalRevenueOTASub",
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
                $tableBody.html('<tr><td colspan="' + columnNumber + '" align="center">'+loaderElem+'</td></tr>');
                $('#revenueOTATab-totalRevenueAmount, #revenueOTATab-totalRevenueAmountIDR, #revenueOTATab-totalJournalPostAmount').html(0);
                $('#revenueOTATab-subJournalStatus').html('-');
                $("#window-loader").modal("show");
            },
            complete: function (jqXHR, textStatus) {
                switch (jqXHR.status) {
                    case 200:
                        var responseJSON        = jqXHR.responseJSON,
                            dataJournalDetailSub= responseJSON.dataJournalDetailSub;
                        generateJournalDetailsSubRevenueOTA(dataJournalDetailSub, defaultCurrency, isJournalPosted)
                        break;
                    case 404:
                    default:
                        $tableBody.html('<tr><td colspan="' + columnNumber + '" align="center">No data available</td></tr>');
                        break;
                }
            }
        }).always(function (jqXHR, textStatus) {
            $("#window-loader").modal("hide");
            NProgress.done();
            setUserToken(jqXHR);
        });
    });
}

function getExchangeRateToIDR(currency) {
    let exchangeRate    =   1;
    return 1;
}

postingJournalFunc();