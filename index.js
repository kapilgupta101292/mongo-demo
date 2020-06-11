const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/playground', {
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to mongodb'))
  .catch((error) =>
    console.log('Error while connecting to the mongodb', error)
  );

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  // or , and

  const course = new Course({
    name: 'Angular course',
    author: 'Mosh',
    tags: ['angular', 'nodejs'],
    isPublished: true,
  });
  const result = await course.save();
  console.log(result);
}

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;
  const courses = await Course
    //.find({ author: 'Mosh', isPublished: true })
    // .find({ price: { $gte: 10, $lte: 20 } })
    // .find()
    // .or([{ author: 'Mosh' }, { isPublished: true }])
    // // .and ([{}])

    // starts with Mosh
    // .find({ author: /^Mosh/ })

    // ends with Hamedani case insensitive
    //    .find({ author: /Hamedani^/i })

    // contains mosh
    .find({ author: /.*Mosh.*/ })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: -1 })
    .select({ name: 1, tags: 1 });
  // .count();
  console.log(courses);
}

async function updateCourse(id) {
  //Approach: Query first
  // findById()
  // Modify its Properties
  // save()
  //   const course = await Course.findById(id);
  //   if (!course) {
  //     console.log('No course found');
  //     return;
  //   }
  //   course.isPublished = true;
  //   course.author = 'Kapil Gupta';
  //   const result = await course.save();
  //   console.log(result);

  // Another Approach
  //   course.set({
  //     isPublished: true,
  //     author: 'Kapil Gupta',
  //   });

  // Approach: Update first
  // update directly
  // Optionally : get the update document.

  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: 'Jason',
        isPublished: false,
      },
    },
    { new: true }
  );
  console.log(course);
}

async function removeCourse(id) {
  //   const result = await Course.deleteOne({ _id: id });
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}
removeCourse('5ee22c862a3e07770eee05bb');
//updateCourse('5ee218a10c6943582d28cc3e');

// getCourses();
