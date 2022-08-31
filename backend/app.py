import re
import os
import json
import seeker
import sqlite3
from flask import Flask
from datetime import date, timedelta, datetime


app = Flask(__name__)


def init():
    # create database if it doesn't exist
    conn = sqlite3.connect('database.db')
    # print("Database created")

    c = conn.cursor()
    # if tables don't exist, create them
    c.execute('''CREATE TABLE IF NOT EXISTS power_outages (id INTEGER PRIMARY KEY, date TEXT, description TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)''')
    conn.commit()
    # print("Tables created")

    # if last_check is not in settings, insert it
    c.execute('''SELECT value FROM settings WHERE key="last_check"''')
    if c.fetchone() == None:
        c.execute('''INSERT INTO settings (key, value) VALUES ("last_check", "2000-01-01")''')
        conn.commit()
        # print("last_check inserted")

init()



def already_done(command):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    
    if command == 'check':
        c.execute('''SELECT value FROM settings WHERE key="last_check"''')
        last_check = c.fetchone()[0]
        return True if last_check == date.today().strftime('%Y-%m-%d') else False
    elif command == 'update':
        c.execute('''UPDATE settings SET value="{}" WHERE key="last_check"'''.format(date.today().strftime('%Y-%m-%d')))
        conn.commit()
    
    conn.close()


def process():
    soup, driver = seeker.access("http://www.seal.com.pe/clientes/SitePages/Cortes.aspx")
    # os.system("cls")

    # remove code blocks
    soup.find('head').decompose()
    soup.find('noscript').decompose()
    soup = soup.find('form', id='aspnetForm')

    id_list= []
    data = re.findall(r'"Strings":\[.*\]', str(soup))[0]
    data = re.findall(r'"\d{4}"', data)

    for item in data:
        id_list.append(item.replace('"', ''))

    # reports = []

    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    # iterate over each power outage report
    for id_ in id_list:
        url = "http://www.seal.com.pe/clientes/Lists/Calendario/DispForm.aspx?ID=" + id_
        
        soup, driver = seeker.access(url, driver)
        # os.system("cls")
        table = soup.find('table', class_='ms-formtable')
        data = table.find_all('tr')

        report = ""
        found_data = False
        has_passed = False
        current_date = ""
        for item in data:
            title = item.find('span').text + ": "
            content = item.find('td', class_='ms-formbody').text.strip()
            if title == 'Hora de inicio: ':
                temp = content[:10].split("/")
                current_date = date(int(temp[2]), int(temp[1]), int(temp[0]))
                if current_date < date.today():
                    has_passed = True
            # if title == 'Descripción: ':
            #     if district.lower() in content.lower() and not has_passed:
            #         found_data = True
            #     pass
            block = title + content + '\n'
            if content != '':
                report += block

        report += '\n'

        if not has_passed:
            current_date = current_date.strftime('%Y-%m-%d')
            conn.execute('''INSERT INTO power_outages (date, description) VALUES ("{}", "{}")'''.format(current_date, report))
            conn.commit()
            # print("{} - {}".format(current_date, report))

    driver.close()




@app.route("/")
def home():
    return "Welcome to the power outage tracker!"


@app.route("/get_data")
def get_data():
    if not already_done('check'):
        # print("Checking for power outages...")
        process()
        already_done('update')
       
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    # print("Getting power outages...")
    c.execute('''SELECT * FROM power_outages''')
    data = c.fetchall()
    # print("Query", str(data))
    # Filter by date
    # data = [item for item in data if datetime(int(item[1][:4]), int(item[1][5:7]), int(item[1][8:10])) >= datetime.today()]
    # print("Filtered", str(data))
    conn.close()

    return json.dumps(data)


if __name__ == '__main__':
   app.run(debug = True, threaded=True)
   