from flask import Flask, render_template, redirect
import pymongo
import scrape_mars

app = Flask(__name__)


client = pymongo.MongoClient()
db = client.mars_info

db.info.drop()

@app.route('/')
def index():
    mars_info = db.info.find_one()
    print(mars_info)
    return render_template('index.html', mars_info=mars_info)


@app.route('/scrape')
def scrape():
    
    data = scrape_mars.scrape()
    db.info.update(
        {},
        data,
        upsert=True
    )
    return redirect('/', code=302)


if __name__ == "__main__":
    app.run(debug=True)