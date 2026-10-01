<x-errors.page
    :code="419"
    :title="__('Page expired')"
    :heading="__('Time ran out')"
    :message="__('Your session expired. Refresh the page and try again.')"
    :action-label="__('Try again')"
    :reload="true"
    :secondary-label="__('Go home')"
    :secondary-url="url('/')"
/>
