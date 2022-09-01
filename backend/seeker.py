from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.edge.service import Service as EdgeService
from webdriver_manager.microsoft import EdgeChromiumDriverManager

from bs4 import BeautifulSoup

def access(url, driver=None):
    # print("Starting...")
    options = Options()
    options.add_argument("--headless")
    # options.add_argument('allow-elevated-browser')

    if driver is None:
        # driver = webdriver.Edge(executable_path="msedgedriver.exe", options=options)
        # service = Service(executable_path='msedgedriver.exe')
        # driver = webdriver.Edge(service = service, options=options)
        # driver = webdriver.microsoft.Edge(EdgeChromiumDriverManager().install(), options=options)
        driver = webdriver.Edge(service=EdgeService(EdgeChromiumDriverManager( path=r"").install()), options=options)
    
    driver.get(url)    
    driver.implicitly_wait(time_to_wait=7)
    # print("Ready!")

    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')

    return soup, driver


def closer(driver):
    driver.close()
