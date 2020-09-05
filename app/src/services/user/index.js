import { UserWallet } from 'database'

const userServices = (() => ({
    createUserWallet(user) {
        return new Promise((resolve, reject) => {
            UserWallet.create({ userId: user._id, clearedBalance: 0, availableBalance: 0 }).then(() => {
                    resolve()
                    return null
                })
                .catch(() => reject('Failed to create wallet!'))
            return null
        })
    }
}))()

module.exports = userServices