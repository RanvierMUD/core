const assert = require('assert');
const CommandQueue = require('../../src/CommandQueue');

describe('Command Queue',  function () {
  let queue = null;
  const originalDateNow = Date.now;

  beforeEach(function (done) {
    queue = new CommandQueue();
    done();
  });

  afterEach(function (done) {
    Date.now = originalDateNow;
    done();
  });

  describe('#enqueue', function () {
    it('should have a command in the queue', function (done) {
      const executable = {
        execute: () => {}
      };
      const index = queue.enqueue(executable, 1);
      assert.equal(queue.commands.length, 1);
      done();
    });

    it('should execute the command', function (done) {
      const executable = {
        execute: () => {
          done();
        }
      };
      queue.enqueue(executable, 1);
      queue.execute();
    });

    it('should have lag', function (done) {
      const lag = 2000;
      const executable = {
        execute: () => {}
      };
      queue.enqueue(executable, lag);
      queue.execute();
      assert.equal(queue.lag, lag);
      done();
    });

    it('should obey lag', function (done) {
      let shouldSucceed = false;
      const lag = 500;
      const executableA = {
        execute: () => {}
      };
      const executableB = {
        execute: () => {
          if (shouldSucceed) {
            return done();
          }

          done(new Error('Executed too early'));
        }
      };
      queue.enqueue(executableA, lag);
      queue.enqueue(executableB, lag);

      Date.now = () => 1000;
      queue.execute();
      assert.equal(queue.lag, lag);

      Date.now = () => 1200;
      assert.equal(queue.execute(), false);

      Date.now = () => 1600;
      shouldSucceed = true;
      queue.execute();
    });

    it('time to run is correct', function (done) {
      const lag = 500;
      const executableA = {
        execute: () => {}
      };
      queue.enqueue(executableA, lag);
      queue.enqueue(executableA, lag);
      queue.enqueue(executableA, lag);

      Date.now = () => 1000;
      assert.equal(queue.msTilNextRun, 0);
      assert.equal(queue.getMsTilRun(0), 0);
      assert.equal(queue.getMsTilRun(1), lag);
      assert.equal(queue.getMsTilRun(2), lag * 2);

      queue.execute();
      assert.equal(queue.msTilNextRun, lag);
      assert.equal(queue.execute(), false);

      Date.now = () => 1500;
      assert.equal(queue.msTilNextRun, 0);
      assert.equal(queue.execute(), true);

      assert.equal(queue.msTilNextRun, lag);
      queue.addLag(200);
      assert.equal(queue.msTilNextRun, lag + 200);

      queue.reset();
      assert.equal(queue.msTilNextRun, 0);
      done();
    });
  });
});
