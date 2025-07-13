// all blogs


fetch('data/blogs.json')
  .then(res => res.json())
  .then(blogs => {
    const containerBlog = document.getElementById('allBlogs');
    containerBlog.innerHTML = blogs.map(blog => `
      <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12 col-12 my-3">
        <div class="blog-card h-100 d-flex flex-column">
          <div class="img-box">
            <img src="${blog.image}" alt="${blog.title}">
          </div>
          <div class = "blog-date">
            <span>${blog.date}</span>
          </div>
          <div class="text-box flex-grow-1">
            <h5 class="mt-3">${blog.title}</h5>
            <h6>${blog.author}</h6>
            <p>${blog.excerpt}</p>
          </div>
          <a href="blog-details.html?id=${blog.id}" class= "blog-btn">Read More</a>
        </div>
      </div>
    `).join('');
  });


  // home blog limit 4


  fetch('data/blogs.json')
  .then(res => res.json())
  .then(blogs => {
    const latest = blogs.slice(0, 4);
    const containerBlog = document.getElementById('latestBlogs');
    containerBlog.innerHTML = latest.map(blog => `
      <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12 col-12 my-3">
        <div class="blog-card h-100 d-flex flex-column">
          <div class="img-box">
            <img src="${blog.image}" alt="${blog.title}">
          </div>
          <div class = "blog-date">
            <span>${blog.date}</span>
          </div>
          <div class="text-box flex-grow-1">
            <h5 class="mt-3">${blog.title}</h5>
            <h6>${blog.author}</h6>
            <p>${blog.excerpt}</p>
          </div>
          <a href="blog-details.html?id=${blog.id}" class= "blog-btn common-btn">Read More</a>
        </div>
      </div>
    `).join('');
  });


  // blog details

  const params = new URLSearchParams(window.location.search);
const blogId = Number(params.get('id'));

fetch('data/blogs.json')
  .then(res => res.json())
  .then(blogs => {
    const blog = blogs.find(b => b.id === blogId);
    if (!blog) return document.getElementById('blogDetails').innerHTML = "<p>Blog not found.</p>";

    document.getElementById('blogDetails').innerHTML = `
      <div class="blog-header">
        <h1>${blog.title}</h1>
        <p class="mb-3">By ${blog.author} on ${blog.date}</p>
      </div>
      <img src="${blog.image}" alt="${blog.title}" class="img-fluid mb-4">
      <div class="blog-content">${blog.content}</div>
    `;
  });

  

  // home blog limit 6


  fetch('data/blogs.json')
  .then(res => res.json())
  .then(blogs => {
    const latest = blogs.slice(0, 5);
    const containerBlog = document.getElementById('detailslatestBlogs');
    containerBlog.innerHTML = latest.map(blog => `
      
        <div class="blogDetailsLatest">
          <div class="img-box">
               <img src="${blog.image}" alt="">
          </div>
          <div class="text-box">
              <h4>${blog.title}</h4>
              <h5>${blog.author}</h5>
              <span class="d-block">${blog.date}</span>
              <a href="blog-details.html?id=${blog.id}" class="related-blog-btn">Read More</a> 
          </div>
          
      </div>


    `).join('');
  });