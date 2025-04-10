module.exports = class UserDto {
    email;
    id;
    isActivated;
    

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.isActivatedSubscription = model.activateSubscriptionExp >= new Date();
        this.dateActivatedSubscription = model.activateSubscriptionExp;
    }
}
