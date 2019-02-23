from bs4 import BeautifulSoup as bs
import requests
import pymongo
from splinter import Browser
import pandas as pd

def init_browser():
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    return Browser("chrome", **executable_path, headless=True)

def scrape():
    browser = init_browser()
    mars_info = {}

    url = 'https://mars.nasa.gov/news/'
    browser.visit(url)

    html = browser.html
    soup = bs(html, "html.parser")

    results_title = soup.find('div', class_='content_title')
    news_title = results_title.find('a').text

    results_paragraph = soup.find('div', class_='rollover_description_inner')
    news_p = results_paragraph.text

    mars_info["news_title"] = news_title
    mars_info["news_p"]= news_p

    url2 = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(url2)
    browser.click_link_by_partial_text('FULL IMAGE')
    image = browser.find_by_css('a.fancybox-expand')
    image.click()

    html2 = browser.html
    soup2 = bs(html2, "html.parser")

    img_url = soup2.find('img', class_='fancybox-image')['src']
    featured_image_url = f'https://www.jpl.nasa.gov{img_url}'

    mars_info["featured_image_url"] = featured_image_url

    twitter_url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(twitter_url)
    html3 = browser.html
    soup3 = bs(html3, "html.parser")

    mars_tweets = soup3.find('ol', class_='stream-items')
    mars_weather = mars_tweets.find('p', class_='tweet-text').text

    mars_info["mars_weather"] = mars_weather

    facts_url = 'http://space-facts.com/mars/'
    browser.visit(facts_url)
    html4 = browser.html
    soup4 = bs(html4, "html.parser")

    table = soup4.find('table', class_='tablepress tablepress-id-mars')
    column1 = table.find_all('td', class_='column-1')
    column2 = table.find_all('td', class_='column-2')

    items = []
    measurements = []

    for row in column1:
        item = row.text.strip()
        items.append(item)

    for row2 in column2:
        measurement = row2.text.strip()
        measurements.append(measurement)

    facts = pd.DataFrame({
        "Items": items,
        "Measurements": measurements
    })

    html_tableString = facts.to_html(header=False, index=False)
    
    mars_info["table_html"] = html_tableString

    hemisphere_url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
   

    browser.visit(hemisphere_url)
    html5 = browser.html
    soup5 = bs(html5, "html.parser")

    image_url = ['https://astropedia.astrogeology.usgs.gov/download/Mars/Viking/cerberus_enhanced.tif/full.jpg',
                'https://astropedia.astrogeology.usgs.gov/download/Mars/Viking/schiaparelli_enhanced.tif/full.jpg',
                'https://astropedia.astrogeology.usgs.gov/download/Mars/Viking/syrtis_major_enhanced.tif/full.jpg',
                'https://astropedia.astrogeology.usgs.gov/download/Mars/Viking/valles_marineris_enhanced.tif/full.jpg'
                ]
    
    title = soup5.find_all('h3')
    title_clean = [x.text.split(';')[-1].strip() for x in title]
    hemisphere_image_url = [{"title": title_clean, "image_url": image_url} for title_clean, image_url in zip (title_clean, image_url)]
    
    mars_info["hemisphere_image_url"] = hemisphere_image_url

    return mars_info

if __name__ == "__main__":
    scrape()
