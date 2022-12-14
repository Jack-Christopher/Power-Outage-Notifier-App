// const { json } = require('express');
const puppeteer = require('puppeteer');
var JSSoup = require('jssoup').default;
const db = require('../services/db');

async function scraper() {
    // get last_update from db
    var last_update = await db.getSetting('last_update');
    last_update = last_update.value;

    console.log('last_update: (' + last_update + ')\n');

    // get list or empty list
    var prevIdList = await db.getIdList();
    prevIdList = prevIdList.data;
    console.log('prevIdList: (' + prevIdList + ')\n');

    if (last_update == new Date().toISOString().slice(0, 10)) {
        console.log('Already updated today');
        
        return prevIdList;
    }

    var url = 'http://www.seal.com.pe/clientes/SitePages/Cortes.aspx';
    const browser = await puppeteer.launch({
        'headless': true,
        'args': ['--no-sandbox']
    });

    console.log('Launching browser...');

    const page = await browser.newPage();
    await page.goto(url, {timeout: 0});
    
    // get by Id aspnetForm
    const form = await page.$('#aspnetForm');
    const formContent = await page.evaluate(form => form.innerHTML, form);

    var id_list = []
    var data = formContent.match(/"Strings":\[.*\]/)[0]
    data = data.match(/"\d{4}"/g)

    console.log('Getting data...');

    for (var i = 0; i < data.length; i++) {
        id_list.push(data[i].replaceAll('"', ''))
    }
    console.log('List of id\'s: ' + id_list, '\n');
    console.log('[[last_update]]: (' + last_update + ')\n');

    // iterate over each power outage report
    for (var i = 0; i < id_list.length; i++) {
        // if id is in prevIdList then skip
        if (prevIdList.includes(parseInt(id_list[i]))) {
            console.log('Reporte: ' + id_list[i], " [", i+1, "/", id_list.length, "] (Already)\n")
            continue;
        }

        console.log('Reporte: ' + id_list[i], " [", i+1, "/", id_list.length, "] (New)\n")
        var url_i = "http://www.seal.com.pe/clientes/Lists/Calendario/DispForm.aspx?ID=" + id_list[i];
        await page.goto(url_i, {timeout: 0});

        var soup = new JSSoup(await page.content());
        var table = soup.find('table', {'class': 'ms-formtable'});
        var rows = table.findAll('tr');
        // get _text_ from each row
        var row_text = []
        for (var j = 0; j < rows.length; j++) {
            row_text.push(rows[j].text)
        }
        // apply function to each row
        row_text = row_text.map(function (x) {
            x = x.replace(/\n\t\t\t/g, '::').replace('Descripci??n', 'Descripci??n::')
            x = x.replace(/\n/g, ' ').replace(/\t/g, ' ').trim();
            return x;
        });

        row_text = row_text.slice(0, 5);

        // console.log('row_text: ', row_text);

        var reportList = [];
        var report = "";
        // var found_data = false;
        var has_passed = false;
        var current_date = null;


        for (var j = 0; j < 5; j++) {
            // split by '::'
            var row = row_text[j].split('::');
            var title = row[0];
            var content = row[1];

            if ( title == 'Hora de inicio') {
                var temp =content.slice(0, 10).split("/");
                current_date = new Date(parseInt(temp[2]), parseInt(temp[1])-1, parseInt(temp[0]));
                
                if (current_date < new Date()) {
                    has_passed = true;
                }
            }

            report += title + ": " + content + "\n";
        }

        reportList.push(report);
        current_date = current_date.toISOString().slice(0, 10);
        db.addReport({id: id_list[i], date: current_date, description: report});
    }

    // close browser
    await browser.close();

    db.setSetting('last_update', new Date().toISOString().slice(0, 10));
    // convert content to json
    const jsonContent = {ids: id_list}

    return jsonContent;
}


module.exports = {
    scraper
}