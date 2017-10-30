var OccasionSDKSpecs = {};

describe('Occasion.Client', function() {
  beforeEach(function() {
    moxios.install();

    window.onSuccess = jasmine.createSpy('onSuccess');
    window.onFailure = jasmine.createSpy('onFailure');
    window.onCompletion = jasmine.createSpy('onCompletion');

    this.occsnClient = Occasion.Client({ token: 'my_token' });
  });

  afterEach(function() {
    moxios.uninstall();
  });

  it('adds resource classes on initialization', function() {
    expect(_.keys(this.occsnClient)).toContain('Product', 'Answer', 'Question', 'Order');
  });

  describe('when token not of type string', function() {
    it('throws error', function() {
      expect(function() { Occasion.Client() }).toThrow('Token must be of type string');
    });
  });

  describe('when making requests', function() {
    beforeEach(function() {
      this.occsnClient.Product.all()
      .then(window.onSuccess);
    });

    it('makes request to default base Occasion API URL', function() {
      expect(moxios.requests.mostRecent().url.indexOf(Occasion.baseUrl)).toEqual(0);
    });

    it('adds token to Authorization header', function() {
      var encodedToken = window.btoa(unescape(encodeURIComponent('my_token:')));

      expect(moxios.requests.mostRecent().headers['Authorization']).toEqual('Basic ' + encodedToken);
    });
  });

  describe('override baseUrl', function() {
    beforeEach(function() {
      this.occsnClient = Occasion.Client({ baseUrl: 'http://occasion.lvh.me:3000/', token: 'my_token' });
    });

    describe('when making requests', function() {
      beforeEach(function() {
        this.occsnClient.Product.all()
        .then(window.onSuccess);
      });

      it('makes request to baseURL', function() {
        expect(moxios.requests.mostRecent().url.indexOf('http://occasion.lvh.me:3000/')).toEqual(0);
      });
    });
  });
});