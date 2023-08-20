const app = {
  use: jest.fn(),
  listen: jest.fn()
};

jest.doMock("express", () => {
  return () => {
    return app;
  };
});

test("should invoke express once", () => {
  expect(app.use).toHaveBeenCalledTimes(1);
});
