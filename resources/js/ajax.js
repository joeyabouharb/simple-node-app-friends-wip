/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-undef */
$(document).ready(() => {
  $('.delete-friend').on('click', (e) => {
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: `/friend/delete/${id}`,
      success: (response) => {
        // eslint-disable-next-line no-alert
        alert('deleting article');
        window.location.href = '/';
      },
      error: (err) => {
        console.log(err);
      },
    });
  });
});
