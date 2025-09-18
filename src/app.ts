import express from 'express';
import morgan from 'morgan';
import imagesRouter from './routes/images';
import { thumbsDir } from './utils/filePaths';

const app = express();

app.use(morgan('dev'));

app.use('/thumbs', express.static(thumbsDir));

app.get('/', (req, res) => {
  res.type('html').send(
    `<h1>Image API</h1>
    <p><code>/api/images?filename=fjord.jpg&width=300&height=200&format=webp</code></p>`,
  );
});

app.use('/api', imagesRouter);

export default app;
