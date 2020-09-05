/**
 * @apiGroup Url Parameter
 * @apiGroup Query Parameter
 * @apiGroup Body Parameter
 */

/**
 * @apiDescription This endpoint authenticates a user to the Bloverse platform via social media platforms (see the parameter section for supported platforms).
 * The url handles the authtication process completely and should be loaded in a browser, if user does not exist on platform a new user is created during the process.
 * There is a redirect to the refferer with a set cookie header after successful process
 * @api {get} /auth/:platform?redirectUrl={url} Login
 * @apiName Authenticates user via specified social platform
 * @apiGroup Auth
 * @apiParam (Url Parameter) {String="facebook","google"} platform The platform user will wants to authenticate with
 * @apiParam (Body Parameter) {String} [redirectUrl="url where user is reffered from or base url"] Url to redirect user to after successful login
 */
