const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/mongo-exercises', {
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to mongodb'))
  .catch((error) =>
    console.log('Error while connecting to the mongodb', error)
  );

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  isPublished: Boolean,
  price: Number,
  date: { type: Date, default: Date.now },
  tags: [String],
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
  const courses = await Course.find({ isPublished: true, tags: 'backend' })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });
  return courses;
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
