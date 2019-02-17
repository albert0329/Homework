from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import scrape_mars

app = Flask(__name__)


mongo = PyMongo(app)


@app.route('/')
def index():
    mars_info = mongo.db.mars_info.find_one()
    return render_template('index.html', mars_info=mars_info)


@app.route('/scrape')
def scrape():
    mars_info = list(mongo.db.mars_info.find())[0]
    data = scrape_mars.scrape()
    mars_info.update(
        {},
        data,
        upsert=True
    )
    return redirect('/', code=302)


if __name__ == "__main__":
    app.run(debug=True)