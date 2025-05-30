import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()
import { userRoutes } from './routes/user.routes'
import { adminRoutes } from './routes/admin.routes'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// routes
app.use('/api/v1', userRoutes)
app.use('/api/admin', adminRoutes)

// start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})