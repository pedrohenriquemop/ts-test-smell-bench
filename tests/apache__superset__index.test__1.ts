test('responds with a 404 when not found', () => {
      const endMock = jest.fn();
      const writeHeadMock = jest.fn();

      const request = {
        url: '/unsupported',
        method: 'GET',
        headers: {
          host: 'example.com',
        },
      };

      const response = {
        writeHead: writeHeadMock,
        end: endMock,
      };

      server.httpRequest(
        request as unknown as http.IncomingMessage,
        response as unknown as http.ServerResponse<http.IncomingMessage>,
      );

      expect(writeHeadMock).toHaveBeenCalledTimes(1);
      expect(writeHeadMock).toHaveBeenLastCalledWith(404);

      expect(endMock).toHaveBeenCalledTimes(1);
      expect(endMock).toHaveBeenLastCalledWith('Not Found');
    })