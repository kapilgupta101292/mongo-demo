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
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
    lowercase: true,
    // uppercase: true,
    trim: true,
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function (v, callback) {
        setTimeout(() => {
          const result = v === null || v.length > 0;
          callback(result);
        }, 4000);
      },
      message: 'A course should have atleast one tag.',
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  // or , and

  const course = new Course({
    name: 'Angular course',
    category: ' Web',
    author: 'Mosh',
    tags: ['frontend'],
    isPublished: true,
    price: 15.8,
  });

  try {
    const result = await course.save();
    // const result = await course.validate();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }
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
    .find({ _id: '5ee39484eb99c42809e0ce6f' })
    // .skip((pageNumber - 1) * pageSize)
    // .limit(pageSize)
    .sort({ name: -1 })
    .select({ name: 1, tags: 1, price: 1 });
  // .count();
  console.log(courses[0].price);
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

// createCourse();
// removeCourse('5ee22c862a3e07770eee05bb');
//updateCourse('5ee218a10c6943582d28cc3e');

getCourses();
