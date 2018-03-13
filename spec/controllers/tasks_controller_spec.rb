require 'rails_helper'

# Specs in this file have access to a helper object that includes
# the TasksHelper. For example:
#
# describe TasksHelper do
#   describe "string concat" do
#     it "concats two strings with spaces" do
#       expect(helper.concat_strings("this","that")).to eq("this that")
#     end
#   end
# end

RSpec.describe TasksController, type: :controller do
  describe "tasks#index" do
    it "should list the tasks in the database" do
      task1 = FactoryBot.create(:task)
      task2 = FactoryBot.create(:task)
      get :index
      expect(response).to have_http_status :success
      response_value = ActiveSupport::JSON.decode(@response.body)
      expect(response_value.count).to eq(2)
    end
  end

  describe "tasks#update" do
    it "should allow tasks to be marked as done" do
      task = FactoryBot.create(:task, done: false)
      put :update, params: {id: task.id, task: {done: true }}
      expect(response).to have_http_status(:success)
      task.reload
      expect(task.done).to eq(true)
    end
  end
end
