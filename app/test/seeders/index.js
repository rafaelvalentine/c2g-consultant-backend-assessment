const seeder = require('mongoose-seed')

// env
const dotenv = require('dotenv')

dotenv.config()

const db = process.env.MONGODB_URI

// Connect to MongoDB via Mongoose
seeder.connect(db, function() {
    // Load Mongoose models
    seeder.loadModels([])

    // Clear specified collections
    seeder.clearModels([], function() {
        // Callback to populate DB once collections have been cleared

        seeder.populateModels(data, function() {
            seeder.disconnect()
        })
    })
})

const data = []